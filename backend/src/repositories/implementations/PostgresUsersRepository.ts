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

			const user: User = {
				email: row.email,
				password: row.password,
				name: row.name,
				id: row.id,
			};

			return user;
		} catch (error) {
			console.error("Erro ao buscar o usuário:", error);
			throw error;
		} finally {
			await client.end();
		}
	}

	async findById(id: string): Promise<User | null> {
		const client = await connectToDatabase();

		try {
			const res = await client.query(
				"SELECT * FROM users WHERE id = $1 LIMIT 1",
				[id]
			);

			if (res.rows.length === 0) {
				return null;
			}

			const row = res.rows[0];
			const user: User = {
				id: row.id,
				email: row.email,
				password: row.password,
				name: row.name,
			};

			return user;
		} catch (error) {
			console.error("Erro ao buscar o usuário por ID:", error);
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

		console.log("Olha o usuário aqui:", user);

		try {
			const res = await client.query(
				"UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING id, name, email, password",
				[user.name, user.email, user.password, user.id]
			);

			if (res.rows.length === 0) {
				throw new Error("User not found.");
			}

			const updatedRow = res.rows[0];
			const updatedUser: User = {
				id: updatedRow.id,
				name: updatedRow.name,
				email: updatedRow.email,
				password: updatedRow.password,
			};

			return updatedUser;
		} catch (error) {
			console.error("Erro ao atualizar o usuário:", error);
			throw error;
		} finally {
			await client.end();
		}
	}

	async delete(id: string): Promise<void | null> {
		const client = await connectToDatabase();

		try {
			const res = await client.query("DELETE FROM users WHERE id = $1", [
				id,
			]);

			if (res.rowCount === 0) {
				throw new Error("User not found.");
			}
		} catch (error) {
			console.error("Erro ao deletar o usuário:", error);
			throw error;
		} finally {
			await client.end();
		}
	}
}
