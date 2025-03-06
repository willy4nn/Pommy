import { CreateGoalController } from "../CreateGoalController";
import { CreateGoalUseCase } from "../CreateGoalUseCase";
import { ICreateGoalResponseDTO } from "../CreateGoalDTO";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../../helpers/ApiResponse";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { v4 as uuidv4 } from "uuid";

// Mocking the use case
jest.mock("../CreateGoalUseCase");

describe("CreateGoalController", () => {
	let createGoalUseCase: jest.Mocked<CreateGoalUseCase>;
	let createGoalController: CreateGoalController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: jest.Mock;

	beforeEach(() => {
		// Creating a mocked instance of the use case
		createGoalUseCase = new CreateGoalUseCase(
			null!
		) as jest.Mocked<CreateGoalUseCase>;

		// Instantiating the controller
		createGoalController = new CreateGoalController(createGoalUseCase);

		// Mocking the request, response, and next function
		nextFunction = jest.fn();
		mockRequest = {
			user: {
				// Mock user UUID
				userId: uuidv4(),
			},
			body: {
				title: "New Goal",
				description: "Description of the goal",
			},
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
	});

	it("should create a new goal and return the created goal data", async () => {
		const createdGoalDTO: ICreateGoalResponseDTO = {
			id: uuidv4(), // Ensuring the ID is a UUID
			title: "New Goal",
			description: "Description of the goal",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Mocking the use case to resolve with the created goal data
		createGoalUseCase.execute.mockResolvedValue(createdGoalDTO);

		// Calling the controller's handle method
		await createGoalController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		// Verifying that the status and response json methods were called correctly
		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.success(createdGoalDTO, "Goal created successfully")
		);
	});

	it("should return an error message if something goes wrong", async () => {
		// Simulating an error in the use case execution
		createGoalUseCase.execute.mockRejectedValue(
			new CustomError(ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_SAVE_FAILED)
		);

		// Calling the controller's handle method and passing the next function
		await createGoalController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		// Expecting the next function to be called with the error
		expect(nextFunction).toHaveBeenCalledWith(
			new CustomError(ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_SAVE_FAILED)
		);
	});
});
