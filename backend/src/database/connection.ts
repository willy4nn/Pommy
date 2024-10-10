import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const createClient = () => {
	return new Client({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		database: process.env.DB_DATABASE,
		password: process.env.DB_PASSWORD,
		port: parseInt(process.env.DB_PORT || "5432"),
	});
};

const connectToDatabase = async () => {
	const client = createClient();
	try {
		await client.connect();
		console.log("Conectado ao PostgreSQL");
		return client;
	} catch (error) {
		console.error("Erro ao conectar ao PostgreSQL:", error.stack);
		throw error;
	}
};

export { connectToDatabase };
