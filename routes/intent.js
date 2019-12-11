const { Router } = require('express');
const { detectIntent } = require('../controllers/intent');

const router = Router();

router.post('/', detectIntent);

module.exports = router;
