import { IUsersRepository } from "../../../../repositories/IUsersRepository";
import { LoginUserUseCase } from "../LoginUserUseCase";
import { LoginUserController } from "../LoginUserController";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { ApiResponse } from "../../../../helpers/ApiResponse";

// Mock the repository and LoginUserUseCase
jest.mock("../../../../repositories/IUsersRepository");
jest.mock("../LoginUserUseCase.ts");

describe("Unit Tests for LoginUserController", () => {
	let loginUserController: LoginUserController;
	let loginUserUseCaseMock: jest.Mocked<LoginUserUseCase>;
	let usersRepositoryMock: jest.Mocked<IUsersRepository>;

	beforeAll(() => {
		// Creating mock for the repository
		usersRepositoryMock = {
			findByEmail: jest.fn(),
			findById: jest.fn(),
			save: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		};

		// Creating mock for LoginUserUseCase and passing the repository mock
		loginUserUseCaseMock = new LoginUserUseCase(
			usersRepositoryMock
		) as jest.Mocked<LoginUserUseCase>;

		// Creating the controller instance passing the mock of LoginUserUseCase
		loginUserController = new LoginUserController(loginUserUseCaseMock);
	});

	it("should return an error when email or password is missing", async () => {
		// Simulating a request without email and password
		const request: any = { body: {} };
		const response: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
		};
		const next = jest.fn();

		// Setting up the use case mock to throw an error
		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
		);
		loginUserUseCaseMock.execute.mockRejectedValue(error);

		// Calling the controller's handle method
		await loginUserController.handle(request, response, next);

		// Verifying if next was called with the correct error
		expect(next).toHaveBeenCalledWith(error);
	});

	it("should not call next on successful login", async () => {
		const request: any = {
			body: { email: "valid@example.com", password: "correctPassword" },
		};
		const response: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
		};
		const next = jest.fn();

		// Simulating a successful login response from the use case with a token
		const token = "some_token";
		loginUserUseCaseMock.execute.mockResolvedValue(token);

		// Calling the controller's handle method
		await loginUserController.handle(request, response, next);

		// Verifying that next was NOT called
		expect(next).not.toHaveBeenCalled();
	});

	it("should set the token in the cookie on successful login", async () => {
		const request: any = {
			body: { email: "user@email.com", password: "Password123@" },
		};
		const response: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
		};
		const next = jest.fn();

		// Simulating a successful login response from the use case with a token
		const token = "some_token";
		loginUserUseCaseMock.execute.mockResolvedValue(token);

		// Calling the controller's handle method
		await loginUserController.handle(request, response, next);

		// Verifying if the cookie was set correctly
		expect(response.cookie).toHaveBeenCalledWith(
			"token",
			token,
			expect.objectContaining({
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 3600000,
				path: "/",
			})
		);
	});

	it("should return a success response with token on successful login", async () => {
		const request: any = {
			body: { email: "test@example.com", password: "password123" },
		};
		const response: any = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			cookie: jest.fn(),
		};
		const next = jest.fn();

		// Simulating a successful login response from the use case with a token
		const token = "some_token";
		loginUserUseCaseMock.execute.mockResolvedValue(token);

		// Calling the controller's handle method
		await loginUserController.handle(request, response, next);

		// Creating the expected response with ApiResponse
		const expectedResponse = ApiResponse.success(
			{
				token,
			},
			"User logged in successfully!"
		);

		// Verifying that the response status is 201 and the body is correct
		expect(response.status).toHaveBeenCalledWith(201);
		expect(response.json).toHaveBeenCalledWith(expectedResponse);
	});
});
