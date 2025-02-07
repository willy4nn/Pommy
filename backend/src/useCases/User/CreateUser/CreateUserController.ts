import { Request, Response } from "express";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserResponseDTO } from "./CreateUserDTO";

export class CreateUserController {
	constructor(private createUserUseCase: CreateUserUseCase) {}
	async handle(
		request: Request,
		response: Response
	): Promise<Response<ICreateUserResponseDTO>> {
		const { name, email, password } = request.body;

		try {
			// Execute the use case to create a new user
			const createdUserDTO = await this.createUserUseCase.execute({
				name,
				email,
				password,
			});

			// Return the created user data with a 201 (Created) status code
			return response.status(201).json(createdUserDTO);
		} catch (err) {
			return response.status(500).json({
				message: err.message || "An unexpected error occurred",
			});
		}
	}
}
