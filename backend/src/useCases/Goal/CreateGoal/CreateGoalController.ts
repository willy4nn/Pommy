import { Request, Response, NextFunction } from "express";
import { CreateGoalUseCase } from "./CreateGoalUseCase";
import { ApiResponse } from "../../../helpers/ApiResponse";
import { ICreateGoalResponseDTO } from "./CreateGoalDTO";

export class CreateGoalController {
	constructor(private createGoalUseCase: CreateGoalUseCase) {}
	async handle(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<Response<ApiResponse<ICreateGoalResponseDTO>>> {
		const { title, description } = request.body;
		const { userId } = request.user;

		try {
			// Execute the use case to create a new goal
			const createdGoalDTO = await this.createGoalUseCase.execute({
				user_id: userId,
				title,
				description,
			});

			const responseBody = ApiResponse.success(
				createdGoalDTO,
				"Goal created successfully"
			);

			// Return the created goal data with a 201 (Created) status code
			return response.status(201).json(responseBody);
		} catch (err) {
			next(err);
		}
	}
}
