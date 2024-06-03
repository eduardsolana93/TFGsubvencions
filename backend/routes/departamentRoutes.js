const express = require('express');
const { getDepartaments } = require('../controllers/departamentController');
const router = express.Router();

router.get('/', getDepartaments);

module.exports = router;
