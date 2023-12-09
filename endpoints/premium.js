import express from 'express';
import { apikey_decorator } from '../cryptfire.js';
var router = express.Router();

router.get('/premium/upgrade/:apikey', apikey_decorator, async (req, res) => {
  const apikey = req.params.apikey;
    if (!cryptfire_validate_apikey(apikey))
      res.send("invalid apikey");

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

    if (docs.total === 0)
      res.send('wrong api key');

    const address = docs.documents[0].wallet;

    // check balance, only do this once per hour per user while we are not paying etherscan yet
    var balance = await api.account.balance(address);

    if (balance < process.env._APP_PRICE_PREMIUM)
      res.send('unpaid');

    const r = await databases.listDocuments('cryptfire', 'api', [
      sdk.Query.match('key', apikey)
    ]);

    if (r.amount > 0)
      console.log('should update api document now');

    res.send(balance.result);
  });

  router.get('/premium/verify/:apikey', apikey_decorator, (req, res) => {
    const apikey = req.params.apikey;
    if (!cryptfire_validate_apikey(apikey)) 
      res.send("invalid apikey");

    // check here if wallet is funded
    res.send('ok');
  });


export default router;
