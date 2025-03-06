import { UpdateGoalUseCase } from "../UpdateGoalUseCase";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { IUpdateGoalRequestDTO } from "../UpdateGoalDTO";
import { PostgresGoalsRepository } from "../../../../repositories/Goals/implementations/PostgresGoalsRepository";
import { Goal } from "../../../../entities/Goal/Goal";

// Mock the repository
jest.mock(
	"../../../../repositories/Goals/implementations/PostgresGoalsRepository"
);

describe("UpdateGoalUseCase", () => {
	let mockGoalsRepository: jest.Mocked<PostgresGoalsRepository>;
	let updateGoalUseCase: UpdateGoalUseCase;

	// Existing goal for testing with valid user_id
	const existingGoal = new Goal(
		{
			title: "Old Title",
			description: "Old Description",
			user_id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
		},
		"goal-uuid",
		new Date("2022-01-01T00:00:00Z"),
		new Date("2022-01-01T00:00:00Z")
	);

	beforeEach(() => {
		mockGoalsRepository =
			new PostgresGoalsRepository() as jest.Mocked<PostgresGoalsRepository>;
		updateGoalUseCase = new UpdateGoalUseCase(mockGoalsRepository);
	});

	it("throws an error if the goal is not found", async () => {
		mockGoalsRepository.findById.mockResolvedValue(null);

		const updateData: IUpdateGoalRequestDTO = {
			id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
			user_id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
			title: "New Title",
			description: "New Description",
		};

		await expect(updateGoalUseCase.execute(updateData)).rejects.toThrow(
			new CustomError(ErrorCatalog.ERROR.GOAL.SERVICE.GOAL_NOT_FOUND)
		);
	});

	it("updates the goal successfully", async () => {
		mockGoalsRepository.findById.mockResolvedValue(existingGoal);
		mockGoalsRepository.update.mockResolvedValue();

		const updateData: IUpdateGoalRequestDTO = {
			id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
			user_id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
			title: "New Title",
			description: "New Description",
		};

		const response = await updateGoalUseCase.execute(updateData);

		expect(response.id).toBe("2397a1fc-2a6d-46e1-9faf-a92b73188f9b");
		expect(response.title).toBe(updateData.title);
		expect(response.description).toBe(updateData.description);
		expect(new Date(response.created_at).toISOString()).toBe(
			existingGoal.createdAt.toISOString()
		);
		expect(response.updated_at).toBeDefined();
	});

	it("keeps old data if not provided", async () => {
		mockGoalsRepository.findById.mockResolvedValue(existingGoal);
		mockGoalsRepository.update.mockResolvedValue();

		const updateData: IUpdateGoalRequestDTO = {
			id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
			user_id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
			title: "Updated Title",
		};

		const response = await updateGoalUseCase.execute(updateData);

		expect(response.title).toBe("Updated Title");
		expect(response.description).toBe(existingGoal.description);
	});
});
