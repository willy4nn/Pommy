import { CreateUserController } from "../CreateUserController";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { ICreateUserResponseDTO } from "../CreateUserDTO";
import { Request, Response } from "express";
import { ApiResponse } from "../../../../helpers/ApiResponse";

// Mocking the use case
jest.mock("../CreateUserUseCase");

describe("CreateUserController", () => {
	let createUserUseCase: jest.Mocked<CreateUserUseCase>;
	let createUserController: CreateUserController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	beforeEach(() => {
		// Creating a mocked instance of the use case
		createUserUseCase = new CreateUserUseCase(
			null!
		) as jest.Mocked<CreateUserUseCase>;

		// Instantiating the controller
		createUserController = new CreateUserController(createUserUseCase);

		// Mocking the request and response
		mockRequest = {
			body: {
				name: "user",
				email: "user@user.com",
				password: "password",
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
			mockResponse as Response
		);

		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.success(createdUserDTO, "User created successfully")
		);
	});

	it("should return an error message if something goes wrong", async () => {
		createUserUseCase.execute.mockRejectedValue(
			new Error("An unexpected error occurred")
		);

		await createUserController.handle(
			mockRequest as Request,
			mockResponse as Response
		);

		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.error(500, "An unexpected error occurred", "Error")
		);
	});
});
