require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD, // Make sure to set this in .env
  database: process.env.DB_NAME || 'blood_bank_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Convert to promise-based pool for async/await
const promisePool = pool.promise();

module.exports = promisePool;
