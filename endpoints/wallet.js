import express from 'express';
var router = express.Router();

router.get('/', async (req, res) => {
  const api_key = req.body.api_key;
  
  res.send({'wallets':[]});
});

router.get('/ethereum', (req, res) => {
  const api_key = req.body.api_key;
  
  res.send({'ethereum':{}});
});

router.get('/fiat', (req, res) => {
  const api_key = req.body.api_key;

  res.send({'fiat':{}});
});

export default router;
