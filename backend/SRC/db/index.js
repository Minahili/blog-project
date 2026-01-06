const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const schema = require("./schema");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false } 
    : false,
});

pool.connect()
  .then(client => {
    console.log("✅ PostgreSQL connected successfully");
    client.release();
  })
  .catch(err => {
    console.error("❌ PostgreSQL connection error:", err);
  });

const db = drizzle(pool, { schema });

module.exports = { db, pool };

