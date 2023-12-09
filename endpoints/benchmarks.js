import express from 'express';
var router = express.Router();

router.get('/:type', async (req, res) => {
  const type = req.params.type;
  res.json({'payload':{}});
});

router.get('/', (req, res) => {
  res.json({'benchmarks':[]});
});

export default router;
