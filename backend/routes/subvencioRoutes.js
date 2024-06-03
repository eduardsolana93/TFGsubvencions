const express = require('express');
const { getSubvencions, getSubvencioById, createSubvencio, updateSubvencio, deleteSubvencio, createPartida } = require('../controllers/subvencioController');
const { authMiddleware } = require('../src/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, getSubvencions);
router.get('/:id', authMiddleware, getSubvencioById);
router.post('/', authMiddleware, createSubvencio);
router.post('/partida', authMiddleware, createPartida);
router.put('/:id', authMiddleware, updateSubvencio);
router.delete('/:id', authMiddleware, deleteSubvencio);

module.exports = router;
