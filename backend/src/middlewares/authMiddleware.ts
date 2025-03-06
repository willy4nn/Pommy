import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../types/DecodedToken";
import { CustomError, ErrorCatalog } from "../errors/CustomError";
const JWT_SECRET = process.env.JWT_SECRET_KEY || "your_secret_key";

export const authMiddleware = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	const token =
		request.cookies.token ||
		request.headers["authorization"]?.split(" ")[1];

	// If no token is provided, throw an error
	if (!token) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
		);
	}

	try {
		// Decode the token
		const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

		// Check if the token contains userId
		if (!decoded.userId) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_TOKEN_PAYLOAD
			);
		}

		// Assign the decoded token to req.user
		request.user = decoded;

		// Continue to the next middleware
		next();
	} catch (err) {
		// If the token is invalid or expired, throw a custom error
		if (err instanceof jwt.JsonWebTokenError) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
			);
		}

		// If the token has expired, throw a custom error
		if (err instanceof jwt.TokenExpiredError) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
			);
		}

		// Throw any other unexpected error
		throw err;
	}
};
