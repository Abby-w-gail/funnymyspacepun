const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false
	}
});

module.exports = pool;

/* creates a connection pool so multiple users can access the database without opening a new connection every single time which would be hard to manage with many people probably */
