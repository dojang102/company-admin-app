const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("PostgreSQL 接続 失敗:", err.stack);
  }
  console.log("PostgreSQL DB 接続 成功");
  release();
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
