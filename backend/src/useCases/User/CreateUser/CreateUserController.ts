import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserResponseDTO } from "./CreateUserDTO";
import { ApiResponse } from "../../../helpers/ApiResponse";

export class CreateUserController {
	constructor(private createUserUseCase: CreateUserUseCase) {}
	async handle(
		request: Request,
		response: Response
	): Promise<Response<ApiResponse<ICreateUserResponseDTO>>> {
		const { name, email, password } = request.body;

		try {
			// Execute the use case to create a new user
			const createdUserDTO = await this.createUserUseCase.execute({
				name,
				email,
				password,
			});

			const responseBody = ApiResponse.success(
				createdUserDTO,
				"User created successfully"
			);

			// Return the created user data with a 201 (Created) status code
			return response.status(201).json(responseBody);
		} catch (err) {
			const responseBody = ApiResponse.error(
				500,
				err.message || "An unexpected error occurred",
				err.name || "Error"
			);

			return response.status(500).json(responseBody);
		}
	}
}
