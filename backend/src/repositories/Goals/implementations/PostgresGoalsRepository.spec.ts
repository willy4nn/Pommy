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

	describe("findById", () => {
		it("should return a Goal if found", async () => {
			const row = {
				id: "goal-id",
				user_id: "user-id",
				title: "Test Goal",
				description: "Test Description",
				created_at: new Date("2023-01-01T00:00:00.000Z"),
				updated_at: new Date("2023-01-02T00:00:00.000Z"),
			};
			mockClient.query.mockResolvedValue({ rows: [row] });

			const result = await repository.findById("goal-id");

			expect(result).toBeInstanceOf(Goal);
			expect(result).toEqual(
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
			expect(mockClient.release).toHaveBeenCalled();
		});

		it("should return null if no goal is found", async () => {
			mockClient.query.mockResolvedValue({ rows: [] });

			const result = await repository.findById("invalid-id");

			expect(result).toBeNull();
			expect(mockClient.release).toHaveBeenCalled();
		});

		it("should throw a CustomError if query fails", async () => {
			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_FIND_FAILED
			);
			mockClient.query.mockRejectedValue(error);

			await expect(repository.findById("goal-id")).rejects.toMatchObject(
				error
			);
			expect(mockClient.release).toHaveBeenCalled();
		});
	});

	describe("update", () => {
		it("should update a goal successfully", async () => {
			const goal = new Goal(
				{
					title: "New Title",
					description: "New Description",
					user_id: "user-id",
				},
				"goal-id",
				new Date("2023-01-01T00:00:00.000Z"),
				new Date("2023-01-02T00:00:00.000Z")
			);
			mockClient.query
				.mockResolvedValueOnce({}) // Update query
				.mockResolvedValueOnce({ rows: [{ count: "1" }] }); // Count query

			await repository.update(goal);

			expect(mockClient.query).toHaveBeenNthCalledWith(
				1,
				"UPDATE goals SET title = $1, description = $2, updated_at = $3 WHERE id = $4",
				[goal.title, goal.description, goal.updatedAt, goal.id]
			);
			expect(mockClient.query).toHaveBeenNthCalledWith(
				2,
				"SELECT COUNT(*) FROM goals WHERE id = $1",
				[goal.id]
			);
			expect(mockClient.release).toHaveBeenCalled();
		});

		it("should throw a CustomError if update query fails", async () => {
			const goal = new Goal(
				{
					title: "New Title",
					description: "New Description",
					user_id: "user-id",
				},
				"goal-id",
				new Date("2023-01-01T00:00:00.000Z"),
				new Date("2023-01-02T00:00:00.000Z")
			);
			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_UPDATE_FAILED
			);
			mockClient.query.mockRejectedValue(error);

			await expect(repository.update(goal)).rejects.toMatchObject(error);
			expect(mockClient.release).toHaveBeenCalled();
		});

		it("should throw a CustomError if goal not found", async () => {
			const goal = new Goal(
				{
					title: "New Title",
					description: "New Description",
					user_id: "user-id",
				},
				"goal-id",
				new Date("2023-01-01T00:00:00.000Z"),
				new Date("2023-01-02T00:00:00.000Z")
			);
			mockClient.query
				.mockResolvedValueOnce({}) // Update query
				.mockResolvedValueOnce({ rows: [{ count: "0" }] }); // Count returns 0

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_UPDATE_FAILED
			);

			await expect(repository.update(goal)).rejects.toMatchObject(error);
			expect(mockClient.release).toHaveBeenCalled();
		});
	});

	describe("delete", () => {
		it("should delete a goal successfully", async () => {
			const goalId = "goal-id";

			mockClient.query.mockResolvedValue({ rowCount: 1 });

			await repository.delete(goalId);

			expect(mockClient.query).toHaveBeenCalledWith(
				"DELETE FROM goals WHERE id = $1",
				[goalId]
			);
			expect(mockClient.release).toHaveBeenCalled();
		});

		it("should throw a CustomError if goal is not found", async () => {
			const goalId = "goal-id";

			mockClient.query.mockResolvedValue({ rowCount: 0 });

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_DELETE_FAILED,
				"Goal not found"
			);

			await expect(repository.delete(goalId)).rejects.toMatchObject(
				error
			);
			expect(mockClient.release).toHaveBeenCalled();
		});

		it("should throw a CustomError if delete query fails", async () => {
			const goalId = "goal-id";
			const errorMessage = "Query failed";
			mockClient.query.mockRejectedValue(new Error(errorMessage));

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_DELETE_FAILED,
				errorMessage
			);

			await expect(repository.delete(goalId)).rejects.toMatchObject(
				error
			);
			expect(mockClient.release).toHaveBeenCalled();
		});
	});
});
