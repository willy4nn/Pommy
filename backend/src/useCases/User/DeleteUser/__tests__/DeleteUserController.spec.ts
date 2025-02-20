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
		};
		mockNext = jest.fn();
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

		// Verify that status 200 was called
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith({
			status: "success",
			message: "User deleted successfully",
			data: {},
		});
	});

	it("should call next with error when user is not found", async () => {
		// Simulate user not found error
		deleteUserUseCase.execute.mockRejectedValueOnce(
			new CustomError(ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND)
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
				message: ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND.message,
				statusCode:
					ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND.statusCode,
			})
		);
	});
});
