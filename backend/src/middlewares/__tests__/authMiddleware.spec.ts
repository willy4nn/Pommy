import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware";
import { CustomError, ErrorCatalog } from "../../errors/CustomError";

jest.mock("jsonwebtoken");

describe("authMiddleware", () => {
	const mockRequest = {} as Request;
	const mockResponse = {} as Response;
	const nextFunction = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should throw NO_TOKEN_PROVIDED error when no token is present", () => {
		mockRequest.cookies = {};
		mockRequest.headers = {};

		try {
			authMiddleware(mockRequest, mockResponse, nextFunction);
		} catch (error) {
			expect(error).toBeInstanceOf(CustomError);
			expect((error as CustomError).errorName).toEqual(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
					.errorName
			);
		}

		// Ensures nextFunction is not called when there is no token
		expect(nextFunction).not.toHaveBeenCalled();
	});

	it("should throw INVALID_TOKEN_PAYLOAD error when token does not contain userId", () => {
		const mockToken = "mockToken";
		(jwt.verify as jest.Mock).mockReturnValueOnce({}); // Simulates a decoded token without userId

		mockRequest.cookies = { token: mockToken };

		authMiddleware(mockRequest, mockResponse, nextFunction);

		// Ensures nextFunction is called with the correct error object
		expect(nextFunction).toHaveBeenCalledWith(
			expect.objectContaining({
				errorName:
					ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_TOKEN_PAYLOAD
						.errorName,
				message:
					ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_TOKEN_PAYLOAD
						.message,
				statusCode:
					ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_TOKEN_PAYLOAD
						.statusCode,
			})
		);
	});

	it("should pass an error to next() when token verification fails", () => {
		const mockToken = "invalidToken";
		const mockError = new Error("Invalid token");
		(jwt.verify as jest.Mock).mockImplementationOnce(() => {
			throw mockError; // Simulates token verification failure
		});

		mockRequest.cookies = { token: mockToken };

		authMiddleware(mockRequest, mockResponse, nextFunction);

		// Ensures the error is passed to nextFunction
		expect(nextFunction).toHaveBeenCalledWith(mockError);
	});

	it("should assign decoded token to req.user and call next() when token is valid", () => {
		const mockToken = "validToken";
		const decodedToken = { userId: "12345" };
		(jwt.verify as jest.Mock).mockReturnValueOnce(decodedToken); // Simulates a valid decoded token

		mockRequest.cookies = { token: mockToken };

		authMiddleware(mockRequest, mockResponse, nextFunction);

		// Ensures the decoded token is assigned to req.user
		expect(mockRequest.user).toEqual(decodedToken);
		// Ensures nextFunction is called without errors
		expect(nextFunction).toHaveBeenCalled();
	});
});
