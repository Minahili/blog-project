const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test connection
pool.connect()
  .then(client => {
    console.log("✅ PostgreSQL connected successfully");
    client.release(); // release connection
  })
  .catch(err => {
    console.error("❌ PostgreSQL connection error:", err);
  });

module.exports = pool;
