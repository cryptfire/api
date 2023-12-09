import { val_api_key, gen_str, mg } from '../cryptfire.js';
import crypto from 'crypto';

import express from 'express';
var router = express.Router();

/* 
  GET /deploy/
  Get active deployments
  unfinished
*/
router.post('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const api_key = req.body.api_key;

  // fix this with a decorator rather than middleware
  if (!val_api_key(api_key)) {
    res.send({'status': "invalid api key"});
    return false;
  }

  res.send({'status': 'ok'});
});



/* 
  POST /deploy/:type
  Deploy virtual or bare metal server
  unfinished
*/
router.post('/deploy/:type', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const api_key = req.body.api_key;
  const email = req.body.phone;

  if (!val_phone(api_key)) {
    res.send({'status': "invalid api key"});
    return false;
  }

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
