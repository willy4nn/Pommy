import { CreateUserController } from "../CreateUserController";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { ICreateUserResponseDTO } from "../CreateUserDTO";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../../helpers/ApiResponse";

// Mocking the use case
jest.mock("../CreateUserUseCase");

describe("CreateUserController", () => {
	let createUserUseCase: jest.Mocked<CreateUserUseCase>;
	let createUserController: CreateUserController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: jest.Mock;

	beforeEach(() => {
		// Creating a mocked instance of the use case
		createUserUseCase = new CreateUserUseCase(
			null!
		) as jest.Mocked<CreateUserUseCase>;

		// Instantiating the controller
		createUserController = new CreateUserController(createUserUseCase);

		// Mocking the request, response, and next function
		nextFunction = jest.fn();
		mockRequest = {
			body: {
				name: "user",
				email: "user@user.com",
				password: "password123", // Change to include a number
			},
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
	});

	it("should create a user and return the user data", async () => {
		const createdUserDTO: ICreateUserResponseDTO = {
			id: "1",
			name: "user",
			email: "user@user.com",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		createUserUseCase.execute.mockResolvedValue(createdUserDTO);

		await createUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.success(createdUserDTO, "User created successfully")
		);
	});

	it("should return an error message if something goes wrong", async () => {
		// Mocking the next middleware
		const nextFunction = jest.fn();

		// Simulating an error in the use case execution
		createUserUseCase.execute.mockRejectedValue(
			new Error("An unexpected error occurred")
		);

		// Calling the controller's 'handle' method and passing the 'next'
		await createUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		// Expecting the next function to be called with the error
		expect(nextFunction).toHaveBeenCalledWith(
			new Error("An unexpected error occurred")
		);
	});
});
