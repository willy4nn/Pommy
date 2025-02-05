import { pool } from "../../config/db";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class PostgresUsersRepository implements IUsersRepository {
	// Method to find user by email
	async findByEmail(email: string): Promise<User> {
		const client = await pool.connect();
		try {
			const res = await client.query(
				"SELECT * FROM users WHERE email = $1",
				[email]
			);
			if (res.rows.length > 0) {
				const userRow = res.rows[0];

				// Pass props and id to the User constructor
				const user = new User(
					{
						name: userRow.name,
						email: userRow.email,
						password: userRow.password,
					},
					userRow.id,
					new Date(userRow.created_at),
					new Date(userRow.updated_at)
				);

				return user;
			}
			return null;
		} catch (error) {
			throw new Error(
				`Error fetching user from the database: ${error.message}`
			);
		} finally {
			client.release(); // Release the client
		}
	}

	// Method to save a new user with createdAt from user object
	async save(user: User): Promise<void> {
		const client = await pool.connect();
		try {
			await client.query(
				"INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
				[user.id, user.name, user.email, user.password, user.createdAt, user.updatedAt]
			);
		} catch (error) {
			throw new Error(
				`Failed to save the user in the database: ${error.message}`
			);
		} finally {
			client.release(); // Release the client
		}
	}
}
