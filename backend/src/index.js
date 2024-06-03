require('dotenv').config();

const express = require('express');
const cors = require('cors');
const userRoutes = require('../routes/userRoutes');
const subvencioRoutes = require('../routes/subvencioRoutes');
const departamentRoutes = require('../routes/departamentRoutes');
const partidaRoutes = require('../routes/partidaRoutes');
const chatgptRoutes = require('../routes/chatgptRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/subvencions', subvencioRoutes);
app.use('/api/departaments', departamentRoutes);
app.use('/api/partides', partidaRoutes);
app.use('/api/chatgpt', chatgptRoutes);

// Ruta per al camí arrel
app.get('/', (req, res) => {
    res.send('Backend del projecte Subvencions està funcionant!');
});

app.listen(PORT, () => {
    console.log(`El servidor està en marxa al port ${PORT}`);
});
