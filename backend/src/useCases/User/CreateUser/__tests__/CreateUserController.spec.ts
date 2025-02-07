import { CreateUserController } from "../CreateUserController";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { ICreateUserResponseDTO } from "../CreateUserDTO";
import { Request, Response } from "express";

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
		// Mocking the use case behavior for success
		const createdUserDTO: ICreateUserResponseDTO = {
			id: "1",
			name: "user",
			email: "user@user.com",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};
		createUserUseCase.execute.mockResolvedValue(createdUserDTO);

		// Calling the controller's method
		await createUserController.handle(
			mockRequest as Request,
			mockResponse as Response
		);

		// Verifying that the status 201 was returned and user data was sent correctly
		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith(createdUserDTO);
	});

	it("should return an error message if something goes wrong", async () => {
		// Mocking an error in the use case
		createUserUseCase.execute.mockRejectedValue(
			new Error("An unexpected error occurred")
		);

		// Calling the controller's method
		await createUserController.handle(
			mockRequest as Request,
			mockResponse as Response
		);

		// Verifying that status 500 was returned and the error message was sent
		expect(mockResponse.status).toHaveBeenCalledWith(500);
		expect(mockResponse.json).toHaveBeenCalledWith({
			message: "An unexpected error occurred",
		});
	});
});
