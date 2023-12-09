import { val_api_key, gen_str, mg } from '../cryptfire.js';
import { apikey_decorator } from '../cryptfire.js';
import crypto from 'crypto';

import express from 'express';
var router = express.Router();

/* 
  GET /deploy/
  Get active deployments
  unfinished
*/
router.get('/', apikey_decorator, async (req, res) => {
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
router.post('/deploy/:type', apikey_decorator, async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const api_key = req.body.api_key;
  const email = req.body.phone;

  if (!val_phone(api_key)) {
    res.send({'status': "invalid api key"});
    return false;
  }

  res.send({'status': 'ok'});
});

export default router;
