import { val_email, gen_str, mg } from '../cryptfire.js';
import crypto from 'crypto';

import express from 'express';
var router = express.Router();

router.post('/', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const email = req.body.email;

  if (!val_email(email))
    res.send("invalid email");

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
    html: `<a href='https://install.cryptfire.io/key/validate/${email}/${code}'>Click here to validate</a>`
  })
  .then(msg => console.log(msg)) // logs response data
  .catch(err => console.error(err)); // logs any error

  res.send({'status': 'ok'});
});

router.post('/validate', async (req, res) => {
  const email = req.body.email;
  const code = req.body.code;

  try {
    await databases.updateDocument('cryptfire', 'api', code, {
      validated: true
    });
    console.log(`${email} validated, api works now. proceding ...`);
  } catch (error) {
    res.send('wrong code');
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
