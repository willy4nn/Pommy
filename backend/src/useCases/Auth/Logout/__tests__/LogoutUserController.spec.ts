import { Request, Response, NextFunction } from "express";
import { LogoutUserController } from "../LogoutUserController"; // Correct path for your controller
import { ApiResponse } from "../../../../helpers/ApiResponse"; // Adjust the path as needed

describe("LogoutUserController", () => {
	let controller: LogoutUserController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockNext: NextFunction;

	beforeEach(() => {
		controller = new LogoutUserController();
		mockRequest = {}; // The request does not need many details for the logout
		mockResponse = {
			clearCookie: jest.fn(),
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
		mockNext = jest.fn(); // Mock for the next function in case of an error
	});

	it("should log the user out and clear the token cookie", async () => {
		// Calls the logout method
		await controller.handle(
			mockRequest as Request,
			mockResponse as Response,
			mockNext
		);

		// Verifies if the 'token' cookie was cleared
		expect(mockResponse.clearCookie).toHaveBeenCalledWith("token", {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			path: "/",
		});

		// Verifies if the response was sent with status 200
		expect(mockResponse.status).toHaveBeenCalledWith(200);

		// Verifies if the response content is as expected
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.success({}, "User logged out successfully!")
		);
	});

	it("should call next if there is an error", async () => {
		// Simulates an error
		mockResponse.clearCookie = jest.fn().mockImplementationOnce(() => {
			throw new Error("Cookie clearing error");
		});

		// Calls the logout method
		await controller.handle(
			mockRequest as Request,
			mockResponse as Response,
			mockNext
		);

		// Verifies if next was called in case of an error
		expect(mockNext).toHaveBeenCalledWith(
			new Error("Cookie clearing error")
		);
	});
});
