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

	if (!token) {
		return next(
			new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
			)
		);
	}

	try {
		// Decodes the token
		const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

		// Checks if the token contains userId and assigns it to req.user
		if (!decoded.userId) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_TOKEN_PAYLOAD
			);
		}

		request.user = decoded; // Assigns the decoded token to req.user

		next();
	} catch (err) {
		// If the token is invalid, handles JWT errors
		if (err instanceof jwt.JsonWebTokenError) {
			return next(
				new CustomError(
					ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
				)
			);
		}

		// If the token has expired, handles TokenExpiredError
		if (err instanceof jwt.TokenExpiredError) {
			return next(
				new CustomError(
					ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
				)
			);
		}

		// Passes any other error to the next error handler
		next(err);
	}
};
