const jwt = require('jsonwebtoken');
const pool = require('./db');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Accés denegat. Token no proporcionat.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const result = await pool.query('SELECT * FROM usuaris WHERE id = $1', [decoded.id]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuari no trobat' });
        }

        req.user = result.rows[0];
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invàlid.' });
    }
};

module.exports = { authMiddleware };
