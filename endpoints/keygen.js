import { val_email, gen_str, mg } from '../cryptfire.js';
import { databases, client, redis_client } from '../cryptfire.js';
import sdk from 'node-appwrite';
import crypto from 'crypto';
import { ethers } from 'ethers';
import express from 'express';

var router = express.Router();

///////////////////////////////////////////////////////////////////////////////

router.post('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const email = req.body.email;

  if (!val_email(email)) {
    res.send({'status': "invalid email"});
    return false;
  }

  // check if email is already registered
  // check if ip is ip banned

  const api_key = gen_str(64);
  const password = gen_str(23);
  const code = gen_str(8);

  console.log(`verify code for ${email} is ${code}`);

  mg.messages.create('cryptfire.io', {
    from: "Cryptfire Team <team@cryptfire.io>",
    to: [email],
    subject: `Verify your Cryptfire ${code}`,
    text: `Submit Code ${code} back to API`,
    html: `<a href='https://install.cryptfire.io/keygen/validate/${email}/${code}'>Click here to validate</a>`
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.error(err)); // logs any error

  await redis_client.set(`verify_${email}`, code);

  res.send({'status': 'ok'});
});

///////////////////////////////////////////////////////////////////////////////

router.get('/validate/:email/:code', async (req, res) => {
  const email = req.params.email;
  const code = req.params.code;
  const api_key = gen_str(64);
  const password = gen_str(23);
 
  // redis security?
  const value = await redis_client.get(`verify_${email}`);
  if (value && code === value) {
    console.log(`${email} validated, api works now. proceding ...`);
  } else {
    res.json({'status':`wrong code`});
    return false;
  }

  let users = new sdk.Users(client);
  try {
    const user_promise = await users.create(sdk.ID.unique(), email, undefined, password, email);
  } catch (error) {
    res.send(error.message);
      return false;
    };

    const wallet = ethers.Wallet.createRandom();
    console.log(`created wallet ${wallet.address} for ${email}`);

    try {
      // setting code as document id because updateDocument in appwrite document is retarded,
      const api_promise = await databases.createDocument('cryptfire', 'api', sdk.ID.unique(), {
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
  
    res.send({'api_key': api_key, 'wallet': wallet.address});
});

export default router;
