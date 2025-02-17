import { Request, Response, NextFunction } from "express";
import { UpdateUserUseCase } from "./UpdateUserUseCase";
import { ApiResponse } from "../../../helpers/ApiResponse";
import { IUpdateUserResponseDTO } from "./UpdateUserDTO";

export class UpdateUserController {
	constructor(private updateUserUseCase: UpdateUserUseCase) {}

	async handle(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<Response<ApiResponse<IUpdateUserResponseDTO>>> {
		// Retrieve the user ID from the req.user object
		const { userId } = request.user;

		// Extract user data from the request body
		const { name, email, password } = request.body;

		try {
			// Execute the use case to update an existing user
			const updatedUserDTO = await this.updateUserUseCase.execute({
				id: userId,
				name,
				email,
				password,
			});

			// Prepare the response body with success message
			const responseBody = ApiResponse.success(
				updatedUserDTO,
				"User updated successfully"
			);

			// Return the updated user data with a 200 (OK) status code
			return response.status(200).json(responseBody);
		} catch (err) {
			next(err);
		}
	}
}
