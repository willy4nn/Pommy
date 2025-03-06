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
}
