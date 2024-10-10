import { app } from "./app";
import { connectToDatabase } from "./database/connection";

const startServer = async () => {
	try {
		const client = await connectToDatabase();
		app.listen(3333, () => {
			console.log("Servidor rodando na porta 3333");
		});
		return client;
	} catch (error) {
		console.error("Erro ao iniciar o servidor", error);
		process.exit(1);
	}
};

startServer();
