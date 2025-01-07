import { app } from "./app";
import { pool } from "./config/db"; // Database connection pool

// Tests database connection before starting the server
pool.connect()
	.then(() => {
		console.log("Connected to the database!");

		// Sets server port from environment or defaults to 3333
		const port = process.env.PORT || 3333;

		// Starts server listening on the specified port
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	})
	.catch((err) => {
		console.error("Database connection error:", err); // Logs and exits if connection fails
		process.exit(1);
	});
