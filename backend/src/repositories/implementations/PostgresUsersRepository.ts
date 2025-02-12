import { pool } from "../../config/db";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";
import { CustomError, ErrorCatalog } from "../../errors/CustomError";

export class PostgresUsersRepository implements IUsersRepository {
	// Method to find user by id
	async findById(id: string): Promise<User> {
		const client = await pool.connect();
		try {
			const res = await client.query(
				"SELECT * FROM users WHERE id = $1",
				[id]
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
			throw new CustomError(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_NOT_FOUND,
				error.message
			);
		} finally {
			client.release(); // Release the client
		}
	}

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
			throw new CustomError(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_NOT_FOUND,
				error.message
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
				[
					user.id,
					user.name,
					user.email,
					user.password,
					user.createdAt,
					user.updatedAt,
				]
			);
		} catch (error) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_SAVE_FAILED,
				error.message
			);
		} finally {
			client.release(); // Release the client
		}
	}

	// Method to update user
	async update(user: User): Promise<void> {
		const client = await pool.connect();
		try {
			await client.query(
				"UPDATE users SET name = $1, email = $2, password = $3, updated_at = $4 WHERE id = $5",
				[user.name, user.email, user.password, user.updatedAt, user.id]
			);
		} catch (error) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_UPDATE_FAILED,
				error.message
			);
		} finally {
			client.release(); // Release the client
		}
	}
}
