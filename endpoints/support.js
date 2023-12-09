import express from 'express';
var router = express.Router();

  router.get('/wallets', async (req, res) => {
    res.send({'wallets':[]});
  });

  router.get('/wallet/ethereum', (req, res) => {
    res.send({'ethereum':{}});
  });

  router.get('/wallet/fiat', (req, res) => {
    res.send({'fiat':{}});
  });

export default router;
