import { Request, Response, NextFunction } from "express";
import { DeleteUserController } from "../DeleteUserController";
import { DeleteUserUseCase } from "../DeleteUserUseCase";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

// Mocking the DeleteUserUseCase
jest.mock("../DeleteUserUseCase");

describe("DeleteUserController", () => {
	let deleteUserUseCase: jest.Mocked<DeleteUserUseCase>;
	let deleteUserController: DeleteUserController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		// Mocks
		deleteUserUseCase = new DeleteUserUseCase(
			null
		) as jest.Mocked<DeleteUserUseCase>;
		deleteUserController = new DeleteUserController(deleteUserUseCase);

		mockRequest = {
			user: { userId: "user-id" }, // Simulating an authenticated user
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
			clearCookie: jest.fn(),
		};
		mockNext = jest.fn();
	});

	it("should call next with user not found error", async () => {
		const error = new CustomError(
			ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND
		);

		// Simulate user not found error
		deleteUserUseCase.execute.mockRejectedValueOnce(error);

		// Call the controller
		await deleteUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			mockNext
		);

		// Verify that next was called with the correct error
		expect(mockNext).toHaveBeenCalledWith(
			expect.objectContaining({
				message: error.message,
				statusCode: error.statusCode,
			})
		);
	});

	it("should call next with an unexpected error", async () => {
		// Simulate an unexpected error
		deleteUserUseCase.execute.mockRejectedValueOnce(
			new Error("Database failure")
		);

		// Call the controller
		await deleteUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			mockNext
		);

		// Verify that next was called with the correct error
		expect(mockNext).toHaveBeenCalledWith(
			expect.objectContaining({
				message: "Database failure",
			})
		);
	});

	it("should call next with insufficient permissions error", async () => {
		// Simulate permission error
		deleteUserUseCase.execute.mockRejectedValueOnce(
			new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
			)
		);

		// Call the controller
		await deleteUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			mockNext
		);

		// Verify that next was called with the correct error
		expect(mockNext).toHaveBeenCalledWith(
			expect.objectContaining({
				message:
					ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
						.message,
				statusCode:
					ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
						.statusCode,
			})
		);
	});

	it("should clear the authentication cookie", async () => {
		// Simulate successful execution of the use case
		deleteUserUseCase.execute.mockResolvedValueOnce(undefined);

		// Call the controller
		await deleteUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			mockNext
		);

		// Verify if the 'clearCookie' method was called correctly
		expect(mockResponse.clearCookie).toHaveBeenCalledWith("token", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
		});
	});

	it("should delete the user and return success", async () => {
		// Simulate successful execution of the use case
		deleteUserUseCase.execute.mockResolvedValueOnce(undefined);

		// Call the controller
		await deleteUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			mockNext
		);

		// Verify that status 200 was called correctly
		expect(mockResponse.status).toHaveBeenCalledTimes(1);
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledTimes(1);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: "success",
			message: "User deleted successfully",
			data: {},
		});
	});
});
