import { Request, Response, NextFunction } from "express";
import { DeleteUserUseCase } from "./DeleteUserUseCase";
import { ApiResponse } from "../../../helpers/ApiResponse";

export class DeleteUserController {
	constructor(private deleteUserUseCase: DeleteUserUseCase) {}

	async handle(request: Request, response: Response, next: NextFunction) {
		// Get the id from the URL params
		const { id } = request.params;

		try {
			// Execute the use case to delete an existing user
			const deletedUserDTO = await this.deleteUserUseCase.execute({
				id,
			});

			// Prepare the response body with success message
			const responseBody = ApiResponse.success(
				{},
				"User deleted successfully"
			);

			// Return the updated user data with a 200 (OK) status code
			return response.status(200).json(responseBody);
		} catch (err) {
			next(err);
		}
	}
}
