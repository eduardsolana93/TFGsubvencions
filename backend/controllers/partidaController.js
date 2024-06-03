const pool = require('../src/db');

const getPartidaQuantitat = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT quantitat_total FROM partides_pressupostaries WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Partida pressupostària no trobada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPartida = async (req, res) => {
    const { numero_partida, exercici, quantitat_total } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO partides_pressupostaries (numero_partida, exercici, quantitat_total) VALUES ($1, $2, $3) RETURNING *',
            [numero_partida, exercici, quantitat_total]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getPartidaQuantitat, createPartida };
