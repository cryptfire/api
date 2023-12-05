// @TODO rewrite this to imports
const express = require('express');
const app = express();
const port = '3000';
const crypto = require('crypto');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, 'install.sh');
const ethers = require('ethers');
const sdk = require('node-appwrite');
const VultrNode = require('@vultr/vultr-node')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

require('dotenv').config() // this goes away with imports

// SDKs
const api = require('etherscan-api').init(process.env._API_ETHERSCAN);
const mg = mailgun.client({username: 'api', key: process.env._API_MAILGUN});
let client = new sdk.Client();
const databases = new sdk.Databases(client);
client
    .setEndpoint('https://appwrite.cryptfire.io/v1') // Your API Endpoint
    .setProject('cryptfire') // Your project ID
    .setKey(process.env._API_APPWRITE) // Your secret API key
;
const vultr = VultrNode.initialize({
  apiKey: 'your-api-key-here',
  baseUrl: 'https://example.com', // Optional
  rateLimit: 600 // Optional
})

// extra file

const cryptfire_make_key = (length) => {
  if (!length) length = 64;
  const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
  return Array.from(crypto.randomBytes(length), byte => characterSet[byte % characterSet.length]).join('');
};

const cryptfire_make_password = (length) => {
  if (!length) length = 15;
  const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
  return Array.from(crypto.randomBytes(length), byte => characterSet[byte % characterSet.length]).join('');
};

const cryptfire_validate_email = (email) => {
  // Regular expression for basic email validation
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

const cryptfire_validate_apikey = (apikey) => {
  return /^[A-Za-z0-9_]+$/.test(apikey) && apikey.length === 64;
}

/*
    @zdanl: https:/install.cryptfire.io/
    Provide a basic script asking for Email to register an API Key
*/

app.get('/', (req, res) => {
  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    if (!err) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(data);
        res.end();
    } else {
        res.send("echo 'were down :('");
    }
  });
});

/*
    @zdanl: https:/install.cryptfire.io/premium/start/:apikey
    Provide API Key and receive an Ethereum Wallet Address to fund



*/

app.get('/premium/upgrade/:apikey', async (req, res) => {
  const apikey = req.params.apikey;
  if (!cryptfire_validate_apikey(apikey)) {
    res.send("invalid apikey");
  }

  // check if user is validated, obtain address
  // the code hack with database id doesn't work here.
  // make this possible in Cryptfire BaaS.
  var docs = [];
  try {
  docs = await databases.listDocuments('cryptfire', 'api', [
    sdk.Query.equal('key', apikey)
  ]);
  } catch (err) {
    console.log('database error: ' + err);
  }

  console.log(docs);

  if (docs.total === 0) {
    res.send('wrong api key');
    return false;
  }


  const address = docs.documents[0].wallet;

  // check balance, only do this once per hour per user while we are not paying etherscan yet
  var balance = await api.account.balance(address);

  if (balance < process.env._APP_PRICE_PREMIUM) {
    res.send('unpaid');
    return false;
  }

  const r = await databases.listDocuments('cryptfire', 'api', [
    sdk.Query.match('key', apikey)
  ]);

  if (r.amount > 0) {
    console.log('should update api document now');
  }

  res.send(balance.result);
});

app.get('/prices/compute', async (req, res) => {
  const type = req.params.type;
  fetch('https://api.coinbase.com/v2/prices/ETH-USD/buy', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
    },
  })
   .then(response => response.json())
   .then(response => {
      const market = response.data.amount;
      const dev = process.env._APP_PRICE_DEV/market;
      const prod = process.env._APP_PRICE_PROD/market;

      res.json({'dev': dev, 'prod': prod});
   })
   .catch(err => {
      const market = 2100;
      const dev = market/process.env._APP_PRICE_DEV;
      const prod = market/process.env._APP_PRICE_PROD;
      res.json({'attention':'coinbase down, estimating', 'dev':dev, 'prod':prod});
   })

});

app.get('/prices/dns', (req, res) => {
  res.send('dns is free :) use ns1.vultr.com');
});



/*
    @zdanl: https:/install.cryptfire.io/premium/verify/:apikey
    Provide an API Key to let us check if the wallet was funded
    If it was, you get an ok. You are now Premium
*/

app.get('/premium/verify/:apikey', (req, res) => {
  const apikey = req.params.apikey;
  if (!cryptfire_validate_apikey(apikey)) {
    res.send("invalid apikey");
  }

  // check here if wallet is funded
  res.send('ok');
});

app.get('/key/validate/:email/:code', async (req, res) => {
  const email = req.params.email;
  const code = req.params.code;

  try {

  await databases.updateDocument('cryptfire', 'api', code, {
    validated: true
  });
  res.send('validated, api works now');
  } catch (error) {
    res.send('wrong code');
  }

});

/*
    @zdanl: https:/install.cryptfire.io/key/:email
    Provide a valid Email address to register with us and receive
    an API Key
*/

app.get('/key/:email', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const email = req.params.email;

  if (!cryptfire_validate_email(email)) {
    res.send("invalid email");
    return false;
  }

  // check if email is already registered
  // check if ip is ip banned

  const api_key = cryptfire_make_key();
  const password = cryptfire_make_password();
  const code = cryptfire_make_password();

  console.log(`verify code for ${email} is ${code}`);

  mg.messages.create('cryptfire.io', {
    from: "Cryptfire Team <team@cryptfire.io>",
    to: [email],
    subject: "Verify your Email for Cryptfire",
    text: `Submit Code ${code} back to API`,
    html: `<a href='https://install.cryptfire.io/key/validate/${email}/${code}'>Click here to validate</a>`
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.error(err)); // logs any error

  let users = new sdk.Users(client);
  try {
    const user_promise = await users.create(sdk.ID.unique(), email, undefined, password, email);
  
  } catch (error) {
    res.send(error.message);
    return false;
  };

  const wallet = ethers.Wallet.createRandom();

  try {
  // setting code as document id because updateDocument in appwrite document is retarded,
  const api_promise = await databases.createDocument('cryptfire', 'api', code, {
    email: email,
    code: code,
    validated: false,
    key: api_key,
    premium: false,
    wallet: wallet.address,
    paid: false,
    balance: 0.0,
  });
  } catch (error) {
    res.send(error);
  }
  
  try {
  const wallet_promise = await databases.createDocument('cryptfire', 'wallets', sdk.ID.unique(), {
    email: email,
    address: wallet.address,
    seedphrase: wallet.mnemonic.phrase,
    privatekey: wallet.privateKey,
    balance: 0.0,
  });
  } catch (error) {
    res.send(error);
  }
  
  res.send(api_key);

});

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
