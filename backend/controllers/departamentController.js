const pool = require('../src/db');

const getDepartaments = async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nom FROM departaments');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDepartaments };
