import { connectToDatabase } from "../../database/connection";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class PostgresUsersRepository implements IUsersRepository {
	async findByEmail(email: string): Promise<User | null> {
		const client = await connectToDatabase();

		try {
			const res = await client.query(
				"SELECT * FROM users WHERE email = $1 LIMIT 1",
				[email]
			);

			if (res.rows.length === 0) {
				return null;
			}

			const row = res.rows[0];
			const user = new User(row.email, row.password);

			return user;
		} catch (error) {
			console.error("Erro ao buscar o usuário:", error);
			throw error;
		} finally {
			await client.end();
		}
	}

	async save(user: User): Promise<void> {
		const client = await connectToDatabase();

		try {
			await client.query(
				"INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)",
				[user.id, user.name, user.email, user.password]
			);
		} catch (error) {
			console.error("Erro ao salvar o usuário:", error);
			throw error;
		} finally {
			await client.end();
		}
	}

	async update(user: User): Promise<User> {
		const client = await connectToDatabase();

		try {
			const res = await client.query(
				"UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING name, email, password",
				[user.name, user.email, user.password, user.id]
			);

			if (res.rows.length === 0) {
				throw new Error("User not found.");
			}

			const updatedRow = res.rows[0];
			const updatedUser = new User(updatedRow.email, updatedRow.password);
			updatedUser.name = updatedRow.name;

			return updatedUser;
		} catch (error) {
			console.error("Erro ao atualizar o usuário:", error);
			throw error;
		} finally {
			await client.end();
		}
	}
}
