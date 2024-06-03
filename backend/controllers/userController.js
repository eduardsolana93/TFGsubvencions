const pool = require('../src/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret';

const registerUser = async (req, res) => {
    const { username, password, nom, cognoms, correu_electronic, departament_id } = req.body;
    if (!username || !password || !nom || !cognoms || !correu_electronic || !departament_id) {
        return res.status(400).json({ error: 'Falten camps obligatoris' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const departamentResult = await pool.query(
            'SELECT id FROM departaments WHERE id = $1',
            [departament_id]
        );

        if (departamentResult.rows.length === 0) {
            return res.status(400).json({ error: 'Departament no trobat' });
        }

        const result = await pool.query(
            'INSERT INTO usuaris (username, password, nom, cognoms, correu_electronic, departament_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, hashedPassword, nom, cognoms, correu_electronic, departament_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM usuaris WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuari no trobat' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Contrasenya incorrecta' });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        const isAdmin = user.username === 'esolana';

        res.json({ token, isAdmin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const verifyToken = (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'Token és necessari' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token no vàlid' });
        }
        res.json({ valid: true, user });
    });
};

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuaris');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser, verifyToken, getAllUsers };
