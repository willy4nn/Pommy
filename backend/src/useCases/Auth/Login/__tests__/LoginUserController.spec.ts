import { Request, Response, NextFunction } from "express";
import { LoginUserController } from "../LoginUserController";
import { ApiResponse } from "../../../../helpers/ApiResponse";

describe("LoginUserController", () => {
	let loginUserController: LoginUserController;
	let loginUserUseCase: { execute: jest.Mock };
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: NextFunction;

	beforeEach(() => {
		loginUserUseCase = { execute: jest.fn() };
		loginUserController = new LoginUserController(loginUserUseCase as any);

		mockRequest = {
			body: { email: "test@example.com", password: "password123" },
		};

		mockResponse = {
			cookie: jest.fn(),
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};

		nextFunction = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should set token cookie and return 201 response when login is successful", async () => {
		const mockToken = "mockToken";
		loginUserUseCase.execute.mockResolvedValueOnce(mockToken);

		await loginUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		expect(mockResponse.cookie).toHaveBeenCalledWith("token", mockToken, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 3600000,
			path: "/",
		});
		expect(mockResponse.status).toHaveBeenCalledWith(201);
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.success(mockToken, "User logged in successfully!")
		);
	});

	it("should call next with error when login fails", async () => {
		const mockError = new Error("Login failed");
		loginUserUseCase.execute.mockRejectedValueOnce(mockError);

		await loginUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		expect(nextFunction).toHaveBeenCalledWith(mockError);
	});
});
