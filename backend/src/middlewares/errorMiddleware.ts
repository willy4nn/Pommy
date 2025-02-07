import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../helpers/ApiResponse";
import { CustomError } from "../errors/CustomError";

// Middleware to handle errors and format error responses
export function errorMiddleware(
	error: CustomError,
	request: Request,
	response: Response,
	next: NextFunction
): Response<ApiResponse<null>> {
	const statusCode = error.statusCode;
	const message = error.message;
	const errorName = error.errorName;
	const details = error.details;

	// Create the error response including the error name
	const errorResponse = ApiResponse.error(
		statusCode,
		message,
		errorName,
		details
	);

	// Return the error response with the correct status code
	return response.status(statusCode).json(errorResponse);
}
