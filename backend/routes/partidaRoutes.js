const express = require('express');
const { getPartidaQuantitat, createPartida } = require('../controllers/partidaController');
const router = express.Router();

router.get('/:id', getPartidaQuantitat);
router.post('/', createPartida);

module.exports = router;
