const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.PGURI,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};