import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../helpers/ApiResponse";
export class LogoutUserController {
	async handle(request: Request, response: Response, next: NextFunction) {
		try {
			// Clear the authentication cookie
			response.clearCookie("token", {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
			});
			// Prepare and send the success response
			const responseBody = ApiResponse.success(
				{},
				"User logged out successfully!"
			);
			return response.status(200).json(responseBody);
		} catch (err) {
			next(err);
		}
	}
}
