import { Request, Response, NextFunction } from "express";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { ApiResponse } from "../../../helpers/ApiResponse";

export class DeleteUserController {
	constructor(private deleteUserUseCase: DeleteUserUseCase) {}

	async handle(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<Response<ApiResponse<null>>> {
		// Retrieve the user ID from the authenticated request
		const { userId } = request.user;

		try {
			// Execute the use case to delete the user
			await this.deleteUserUseCase.execute({ id: userId });

			// Clear the authentication cookie
			response.clearCookie("token", {
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				path: "/",
			});

			// Return a success response
			const responseBody = ApiResponse.success(
				{},
				"User deleted successfully"
			);

			return response.status(200).json(responseBody);
		} catch (err) {
			next(err);
		}
	}
}
