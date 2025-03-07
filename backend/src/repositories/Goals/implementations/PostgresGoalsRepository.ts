import { pool } from "../../../config/db";
import { Goal } from "../../../entities/Goal/Goal";
import { IGoalsRepository } from "../IGoalsRepository";
import { CustomError, ErrorCatalog } from "../../../errors/CustomError";

export class PostgresGoalsRepository implements IGoalsRepository {
	// Method to save a goal
	async save(goal: Goal): Promise<void> {
		const client = await pool.connect();
		try {
			await client.query(
				"INSERT INTO goals (id, user_id, title, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
				[
					goal.id,
					goal.user_id,
					goal.title,
					goal.description,
					goal.createdAt,
					goal.updatedAt,
				]
			);
		} catch (error) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_SAVE_FAILED,
				error.message
			);
		} finally {
			client.release(); // Release the client
		}
	}

	// Method to find a goal by id
	async findById(id: string): Promise<Goal | null> {
		const client = await pool.connect();
		try {
			const result = await client.query(
				"SELECT * FROM goals WHERE id = $1",
				[id]
			);

			if (result.rows.length === 0) {
				return null;
			}

			const row = result.rows[0];

			return new Goal(
				{
					title: row.title,
					description: row.description,
					user_id: row.user_id,
				},
				row.id,
				row.created_at,
				row.updated_at
			);
		} catch (error) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_FIND_FAILED,
				error.message
			);
		} finally {
			client.release();
		}
	}

	// Method to count the number of goals for a specific user
	async countByUserId(userId: string): Promise<number> {
		const client = await pool.connect();
		try {
			const result = await client.query(
				"SELECT COUNT(*) AS total_goals FROM goals WHERE user_id = $1",
				[userId]
			);

			return parseInt(result.rows[0].total_goals, 10);
		} catch (error) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_COUNT_FAILED,
				error.message
			);
		} finally {
			client.release(); // Release the client
		}
	}

	// Method to update a goal
	async update(goal: Goal): Promise<void> {
		const client = await pool.connect();
		try {
			await client.query(
				"UPDATE goals SET title = $1, description = $2, updated_at = $3 WHERE id = $4",
				[goal.title, goal.description, goal.updatedAt, goal.id]
			);

			const result = await client.query(
				"SELECT COUNT(*) FROM goals WHERE id = $1",
				[goal.id]
			);

			if (parseInt(result.rows[0].count, 10) === 0) {
				throw new CustomError(
					ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_FIND_FAILED
				);
			}
		} catch (error) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_UPDATE_FAILED,
				error.message
			);
		} finally {
			client.release();
		}
	}

	// Method to delete a goal by id
	async delete(id: string): Promise<void> {
		const client = await pool.connect();
		try {
			const result = await client.query(
				"DELETE FROM goals WHERE id = $1",
				[id]
			);

			if (result.rowCount === 0) {
				throw new CustomError(
					ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_FIND_FAILED
				);
			}
		} catch (error) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_DELETE_FAILED,
				error.message
			);
		} finally {
			client.release();
		}
	}

	// Method to find all goals by user id
	async findAllByUserId(userId: string): Promise<Goal[]> {
		const client = await pool.connect();
		try {
			const result = await client.query(
				"SELECT * FROM goals WHERE user_id = $1",
				[userId]
			);

			return result.rows.map(
				(row) =>
					new Goal(
						{
							title: row.title,
							description: row.description,
							user_id: row.user_id,
						},
						row.id,
						row.created_at,
						row.updated_at
					)
			);
		} catch (error) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_FIND_ALL_FAILED,
				error.message
			);
		} finally {
			client.release();
		}
	}
}
