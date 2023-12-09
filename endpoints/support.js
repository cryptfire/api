import express from 'express';
import { apikey_decorator } from '../cryptfire.js';

var router = express.Router();

router.get('/', apikey_decorator, async (req, res) => {
  res.send({'status':'ok'});
});

router.get('/create', apikey_decorator, (req, res) => {
  res.send({'ethereum':{}});
});

router.get('/reply', apikey_decorator, (req, res) => {
  res.send({'fiat':{}});
});

export default router;
