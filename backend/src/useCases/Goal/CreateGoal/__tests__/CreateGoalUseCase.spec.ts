import { CreateGoalUseCase } from "../CreateGoalUseCase";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { ICreateGoalRequestDTO } from "../CreateGoalDTO";
import { PostgresGoalsRepository } from "../../../../repositories/Goals/implementations/PostgresGoalsRepository";
import { v4 as uuidv4 } from "uuid";

// Mock of PostgresGoalsRepository
jest.mock(
	"../../../../repositories/Goals/implementations/PostgresGoalsRepository"
);

describe("CreateGoalUseCase", () => {
	let mockGoalsRepository: jest.Mocked<PostgresGoalsRepository>;
	let createGoalUseCase: CreateGoalUseCase;

	beforeAll(() => {
		// Initialize the mock repository
		mockGoalsRepository =
			new PostgresGoalsRepository() as jest.Mocked<PostgresGoalsRepository>;

		// Define the behavior of the mock methods here
		mockGoalsRepository.save.mockResolvedValue();

		// Create an instance of the use case with the mock repository
		createGoalUseCase = new CreateGoalUseCase(mockGoalsRepository);
	});

	it("throws error if the goal limit is reached", async () => {
		mockGoalsRepository.countByUserId.mockResolvedValue(5);

		const error = new CustomError(
			ErrorCatalog.ERROR.GOAL.SERVICE.GOAL_LIMIT_REACHED
		);

		const goalProps: ICreateGoalRequestDTO = {
			user_id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
			title: "Title",
			description: "Description",
		};

		await expect(createGoalUseCase.execute(goalProps)).rejects.toThrow(
			error
		);
	});

	it("creates the goal successfully", async () => {
		// Simulating that the user has no goals yet
		mockGoalsRepository.countByUserId.mockResolvedValue(0);

		const goalProps: ICreateGoalRequestDTO = {
			user_id: "2397a1fc-2a6d-46e1-9faf-a92b73188f9b",
			title: "Title",
			description: "Description",
		};

		// Call the use case to create the goal
		const response = await createGoalUseCase.execute(goalProps);

		// Verify if the return contains the expected values
		expect(response.title).toBe(goalProps.title);
		expect(response.description).toBe(goalProps.description);

		// Verify if the ID is defined and is a valid UUID
		expect(response.id).toBeDefined();

		// Verify if created_at and updated_at are instances of Date and are in ISOString format
		expect(response.created_at).toBeDefined();
		expect(new Date(response.created_at).toISOString()).toBe(
			response.created_at
		);

		expect(response.updated_at).toBeDefined();
		expect(new Date(response.updated_at).toISOString()).toBe(
			response.updated_at
		);
	});

	it("should throw an error if the user_id is in an invalid format", async () => {
		// Simulating that the user has no goals yet
		mockGoalsRepository.countByUserId.mockResolvedValue(0);

		// Overriding uuidv4 to force an invalid value
		const invalidUuid = "invalid-uuid-format";

		const goalProps: ICreateGoalRequestDTO = {
			user_id: invalidUuid,
			title: "Title",
			description: "Description",
		};

		// Expects a specific error to be thrown due to the invalid UUID
		await expect(createGoalUseCase.execute(goalProps)).rejects.toThrowError(
			new CustomError(
				ErrorCatalog.ERROR.GOAL.VALIDATION.USER_ID_INVALID_FORMAT
			)
		);
	});
});
