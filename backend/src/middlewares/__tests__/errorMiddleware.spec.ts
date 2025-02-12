import { Request, Response, NextFunction } from "express";
import { errorMiddleware } from "../errorMiddleware";
import { ApiResponse } from "../../helpers/ApiResponse";
import { CustomError } from "../../errors/CustomError";

describe("errorMiddleware", () => {
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: NextFunction;

	beforeEach(() => {
		mockRequest = {};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		nextFunction = jest.fn();
	});

	it("should handle a CustomError and return formatted error response", () => {
		const customError = new CustomError(
			{
				message: "Something went wrong",
				statusCode: 400,
				errorName: "BAD_REQUEST",
			},
			"Additional details"
		);

		errorMiddleware(
			customError,
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		// Ensure response status is set correctly
		expect(mockResponse.status).toHaveBeenCalledWith(400);

		// Ensure response JSON is called with formatted error response
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.error(
				400,
				"Something went wrong",
				"BAD_REQUEST",
				"Additional details"
			)
		);

		// Ensure nextFunction is not called
		expect(nextFunction).not.toHaveBeenCalled();
	});

	it("should handle a CustomError without optional details", () => {
		const customError = new CustomError({
			message: "Unauthorized access",
			statusCode: 401,
			errorName: "UNAUTHORIZED",
		});

		errorMiddleware(
			customError,
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		// Ensure response status is set correctly
		expect(mockResponse.status).toHaveBeenCalledWith(401);

		// Ensure response JSON is called with formatted error response
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.error(
				401,
				"Unauthorized access",
				"UNAUTHORIZED",
				undefined
			)
		);

		// Ensure nextFunction is not called
		expect(nextFunction).not.toHaveBeenCalled();
	});
});
