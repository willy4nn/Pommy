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

		expect(() =>
			authMiddleware(mockRequest, mockResponse, nextFunction)
		).toThrow(
			expect.objectContaining({
				errorName:
					ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
						.errorName,
			})
		);
		expect(nextFunction).not.toHaveBeenCalled();
	});

	it("should throw INVALID_TOKEN_PAYLOAD error when token does not contain userId", () => {
		const mockToken = "mockToken";
		(jwt.verify as jest.Mock).mockReturnValueOnce({}); // Simulates a decoded token without userId

		mockRequest.cookies = { token: mockToken };

		expect(() =>
			authMiddleware(mockRequest, mockResponse, nextFunction)
		).toThrow(
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
		expect(nextFunction).not.toHaveBeenCalled();
	});

	it("should throw INVALID_OR_EXPIRED_TOKEN error when token verification fails", () => {
		const mockToken = "invalidToken";
		const mockError = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
		);
		(jwt.verify as jest.Mock).mockImplementationOnce(() => {
			throw mockError; // Simulates token verification failure
		});

		mockRequest.cookies = { token: mockToken };

		expect(() =>
			authMiddleware(mockRequest, mockResponse, nextFunction)
		).toThrow(
			expect.objectContaining({
				errorName: mockError.errorName,
			})
		);
		expect(nextFunction).not.toHaveBeenCalled();
	});

	it("should assign decoded token to req.user and call next() when token is valid", () => {
		const mockToken = "validToken";
		const decodedToken = { userId: "12345" };
		(jwt.verify as jest.Mock).mockReturnValueOnce(decodedToken); // Simulates a valid token

		mockRequest.cookies = { token: mockToken };

		authMiddleware(mockRequest, mockResponse, nextFunction);

		expect(mockRequest.user).toEqual(decodedToken);
		expect(nextFunction).toHaveBeenCalled();
	});
});
