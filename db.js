const { Pool } = require("pg");

const pool = new Pool({
  host: "10.130.0.219",
  port: 5442,
  user: "root",
  password: "ZKTeco##123",
  database: "biosecurity-boot",
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    console.log("Connected to database:", res.rows[0].now);
  }
});

module.exports = pool;
