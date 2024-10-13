import { Request, Response } from "express";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

export class DeleteUserController {
	constructor(private deleteUserUseCase: DeleteUserUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const { email, id } = request.body;

		try {
			await this.deleteUserUseCase.execute({
				email,
				id,
			});

			return response.status(200).send();
		} catch (err) {
			return response.status(400).json({
				message: err.message || "Unexpected error.",
			});
		}
	}
}
