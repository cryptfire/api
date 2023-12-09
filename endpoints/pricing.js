import express from 'express';
var router = express.Router();

// be neither immoral nor unethical here

router.get('/powerdev', async (req, res) => {
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
    const dev = process.env._APP_PRICE_VIRT/market;
    const prod = process.env._APP_PRICE_BARE/market;

    res.json({'dev': dev, 'prod': prod});
  })
  .catch(err => {
    const market = 2100;
    const dev = market/process.env._APP_PRICE_DEV;
    const prod = market/process.env._APP_PRICE_PROD;
    res.json({'attention':'coinbase down, estimating', 'dev':dev, 'prod':prod});
  })

});

router.get('/cloud', async (req, res) => {
  const type = req.params.type;
  let clouds = {
    'hetzner': {},
    'vultr': {},
    'google': {}
  };

  fetch('https://api.vultr.com/v2/plans', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
  .then(response => response.json())
  .then(response => {
    res.json(response);
  })
  .catch(err => {
    res.json({'attention':'vultr down'});
  })
});

router.get('/baremetal', async (req, res) => {
  const type = req.params.type;
  let clouds = {
    'hetzner': {},
    'vultr': {},
    'google': {}
  };

  fetch('https://api.vultr.com/v2/plans-metal', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
  .then(response => response.json())
  .then(response => {
    res.json(response);
  })
  .catch(err => {
    res.json({'attention':'vultr down'});
  })
});

router.get('/dns', (req, res) => {
  res.send('dns is free :) use ns1.vultr.com');
});

export default router;
