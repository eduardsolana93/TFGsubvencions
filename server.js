const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const partidaRoutes = require('./routes/partidaRoutes');

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'subvencions',
    password: 'u0c3du',
    port: 5432,
});

const JWT_SECRET = 'el_teu_secret_jwt';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Autenticación de Token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Token no trobat');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token no vàlid');
        req.user = user;
        next();
    });
};

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/partides', partidaRoutes);

// Ruta de ejemplo protegida con autenticación
app.post('/chat', authenticateToken, async (req, res) => {
    const { query } = req.body;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/engines/davinci-codex/completions',
            {
                prompt: query,
                max_tokens: 150,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                },
            }
        );

        res.json(response.data.choices[0].text.trim());
    } catch (error) {
        res.status(500).send('Error amb l\'API de ChatGPT');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

module.exports = { pool };
