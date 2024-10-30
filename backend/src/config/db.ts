require("dotenv").config(); // Loads environment variables from .env file

import { Pool } from "pg"; // Imports PostgreSQL Pool for connection handling

// Configures the database connection pool
const pool = new Pool({
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	max: 20,
	idleTimeoutMillis: 30000,
});

export { pool }; // Exports the configured pool for use in other modules
