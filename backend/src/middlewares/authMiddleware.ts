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
		throw new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
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
		next(err);
	}
};
