import { val_api_key, gen_str, mg } from '../cryptfire.js';
import { apikey_decorator, databases } from '../cryptfire.js';
import crypto from 'crypto';

import express from 'express';
var router = express.Router();

/* 
  GET /account/
  Get account details
  unfinished
*/
router.get('/', apikey_decorator, async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  res.send({'status': 'ok'});
});



/* 
  POST /account/phone
  Update Phone Number
  unfinished
*/
router.post('/phone', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const api_key = req.body.api_key;
  const email = req.body.phone;

  if (!val_phone(phone)) {
    res.send({'status': "invalid phone"});
    return false;
  }

  const code = gen_str(4);

  console.log(`verify code for ${phone} is ${code}`);
  twilio.messages
    .create({
      body: `Cryptfire Verify Code ${code}`,
      to: phone, // Text your number
      from: '+12345678901', // From a valid Twilio number
    })
    .then((message) => console.log(message.sid));
  
  res.send({'status': 'ok'});
});

/* 
  POST /account/phone/validate/:code
  Update Phone Number
  unfinished
*/
router.post('/phone/validate', async (req, res) => {
  const email = req.body.phone;
  const code = req.body.code;

  try {
    const docs = databases.listDocuments('cryptfire', 'api');

    await databases.updateDocument('cryptfire', 'api', code, {
      validated: true
    });
    console.log(`${email} validated, api works now. proceding ...`);
  } catch (error) {
    res.json({'status':'wrong code'});
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

export default router;
