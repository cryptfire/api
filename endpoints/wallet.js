import express from 'express';
import { apikey_decorator } from '../cryptfire.js';

var router = express.Router();

router.get('/', apikey_decorator, async (req, res) => {
  const api_key = req.body.api_key;
  
  res.send({'wallets':[]});
});

router.get('/ethereum', apikey_decorator, (req, res) => {
  const api_key = req.body.api_key;
  
  res.send({'ethereum':{}});
});

router.get('/fiat', apikey_decorator, (req, res) => {
  const api_key = req.body.api_key;

  res.send({'fiat':{}});
});

export default router;
