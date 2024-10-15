import { Request, Response } from "express";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
	constructor(private updateUserUseCase: UpdateUserUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const id = request.user.id;

		const { name, email, password } = request.body;

		try {
			await this.updateUserUseCase.execute(id, {
				name,
				email,
				password,
			});

			return response.status(200).send();
		} catch (err) {
			return response.status(400).json({
				message: err.message || "Unexpected error.",
			});
		}
	}
}
