const pool = require('../src/db');

const getSubvencions = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subvencions WHERE departament_id = (SELECT id FROM departaments WHERE nom = $1)', [req.user.departament]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSubvencioById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM subvencions WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Subvenció no trobada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createSubvencio = async (req, res) => {
    const { titol, descripcio, quantitat, data_inici, data_fi, partida_id, departament_id } = req.body;

    try {
        // Verificar si la partida pressupostària existeix
        const partidaResult = await pool.query('SELECT * FROM partides_pressupostaries WHERE id = $1', [partida_id]);

        if (partidaResult.rows.length === 0) {
            // Informar a l'usuari que la partida no existeix i sol·licitar els detalls necessaris per crear-la
            return res.status(400).json({
                error: 'Partida pressupostària no trobada. Proporcioneu els detalls per crear una nova partida.',
                necessitaCrearPartida: true
            });
        }

        // Si la partida existeix, crear la subvenció
        const result = await pool.query(
            'INSERT INTO subvencions (titol, descripcio, quantitat, data_inici, data_fi, partida_id, departament_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [titol, descripcio, quantitat, data_inici, data_fi, partida_id, departament_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateSubvencio = async (req, res) => {
    const { id } = req.params;
    const { titol, descripcio, quantitat, data_inici, data_fi, partida_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE subvencions SET titol = $1, descripcio = $2, quantitat = $3, data_inici = $4, data_fi = $5, partida_id = $6 WHERE id = $7 RETURNING *',
            [titol, descripcio, quantitat, data_inici, data_fi, partida_id, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Subvenció no trobada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteSubvencio = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM subvencions WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Subvenció no trobada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createPartida = async (req, res) => {
    const { id, numero_partida, exercici, quantitat_total } = req.body;

    try {
        // Crear la nova partida pressupostària
        const result = await pool.query(
            'INSERT INTO partides_pressupostaries (id, numero_partida, exercici, quantitat_total) VALUES ($1, $2, $3, $4) RETURNING *',
            [id, numero_partida, exercici, quantitat_total]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getSubvencions, getSubvencioById, createSubvencio, updateSubvencio, deleteSubvencio, createPartida };