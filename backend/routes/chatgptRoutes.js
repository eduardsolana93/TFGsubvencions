const express = require('express');
const router = express.Router();
const chatgptController = require('../controllers/chatgptController');

// Ruta per obtenir respostes de ChatGPT
router.post('/consultar', chatgptController.getAnswer);

module.exports = router;
