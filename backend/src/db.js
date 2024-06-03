const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'subvencions',
    password: 'u0c3du',
    port: 5432,
});

module.exports = pool;