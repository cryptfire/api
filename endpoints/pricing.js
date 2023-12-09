import express from 'express';
var router = express.Router();

  router.get('/prices/compute', async (req, res) => {
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

  router.get('/prices/dns', (req, res) => {
    res.send('dns is free :) use ns1.vultr.com');
  });

export default router;
