import express from 'express';
var router = express.Router();

router.get('/', async (req, res) => {
  res.send({'status':'ok'});
});

router.get('/create', (req, res) => {
  res.send({'ethereum':{}});
});

router.get('/reply', (req, res) => {
  res.send({'fiat':{}});
});

export default router;
