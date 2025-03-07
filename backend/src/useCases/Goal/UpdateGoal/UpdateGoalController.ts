import { Request, Response, NextFunction } from "express";
import { UpdateGoalUseCase } from "./UpdateGoalUseCase";
import { ApiResponse } from "../../../helpers/ApiResponse";
import { IUpdateGoalResponseDTO } from "./UpdateGoalDTO";

export class UpdateGoalController {
	constructor(private updateGoalUseCase: UpdateGoalUseCase) {}
	async handle(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<Response<ApiResponse<IUpdateGoalResponseDTO>>> {
		const { id, title, description } = request.body;
		const { userId } = request.user;

		try {
			// Execute the use case to update a goal
			const updateGoalDTO = await this.updateGoalUseCase.execute({
				id,
				user_id: userId,
				title,
				description,
			});

			const responseBody = ApiResponse.success(
				updateGoalDTO,
				"Goal updated successfully"
			);

			// Return the updated goal data with a 200 (OK) status code
			return response.status(200).json(responseBody);
		} catch (err) {
			next(err);
		}
	}
}
