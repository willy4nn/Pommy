import { Goal } from "../../../entities/Goal/Goal";
import { PostgresGoalsRepository } from "./PostgresGoalsRepository";
import { pool } from "../../../config/db";
import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { User } from "../../../entities/User/User";

describe("PostgresGoalsRepository - Unit", () => {
	let mockClient: any;
	let repository: PostgresGoalsRepository;

	beforeEach(() => {
		// Create a mock client and replace the pool's connect method
		mockClient = {
			query: jest.fn(),
			release: jest.fn(),
		};
		(pool as any).connect = jest.fn().mockResolvedValue(mockClient);

		repository = new PostgresGoalsRepository();
	});

	describe("save", () => {
		it("should successfully save a Goal", async () => {
			const userProps = {
				name: "user",
				email: "user@email.com",
				password: "Password123@",
			};

			const user = new User(userProps);

			const props = {
				user_id: user.id,
				title: "Goal Test",
				description:
					"A long-term objective that requires consistent effort and strategic planning to achieve meaningful results.",
			};

			const goal = new Goal(props);

			await repository.save(goal);

			expect((pool as any).connect).toHaveBeenCalled();
			expect(mockClient.query).toHaveBeenCalledWith(
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
			expect(mockClient.release).toHaveBeenCalled();
		});

		it("should throw a CustomError if the query fails", async () => {
			const errorMessage = "Query failed";
			mockClient.query.mockRejectedValue(new Error(errorMessage));

			const userProps = {
				name: "user",
				email: "user@email.com",
				password: "Password123@",
			};

			const user = new User(userProps);

			const props = {
				user_id: user.id,
				title: "Goal Test",
				description:
					"A long-term objective that requires consistent effort and strategic planning to achieve meaningful results.",
			};

			const goal = new Goal(props);

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_SAVE_FAILED,
				errorMessage
			);

			await expect(repository.save(goal)).rejects.toMatchObject({
				message: error.message,
				statusCode: error.statusCode,
			});

			expect(mockClient.release).toHaveBeenCalled();
		});
	});

	describe("countByUserId", () => {
		it("should return the number of goals", async () => {
			const userId = "user-id";
			const totalGoals = 5;

			mockClient.query.mockResolvedValue({
				rows: [{ total_goals: totalGoals.toString() }],
			});

			const result = await repository.countByUserId(userId);

			expect((pool as any).connect).toHaveBeenCalled();
			expect(mockClient.query).toHaveBeenCalledWith(
				"SELECT COUNT(*) AS total_goals FROM goals WHERE user_id = $1",
				[userId]
			);
			expect(result).toBe(totalGoals);
			expect(mockClient.release).toHaveBeenCalled();
		});

		it("should return an error if unable to fetch the number of goals", async () => {
			const userId = "user-id";
			const errorMessage = "Query failed";

			mockClient.query.mockRejectedValue(new Error(errorMessage));

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_COUNT_FAILED,
				errorMessage
			);

			await expect(
				repository.countByUserId(userId)
			).rejects.toMatchObject({
				message: error.message,
				statusCode: error.statusCode,
			});

			expect(mockClient.release).toHaveBeenCalled();
		});
	});
});
