import { Request, Response, NextFunction } from "express";
import { DeleteGoalUseCase } from "./DeleteGoalUseCase";
import { ApiResponse } from "../../../helpers/ApiResponse";
import { IDeleteGoalRequestDTO } from "./DeleteGoalDTO";

export class DeleteGoalController {
	constructor(private deleteGoalUseCase: DeleteGoalUseCase) {}
	async handle(
		request: Request,
		response: Response,
		next: NextFunction
	): Promise<Response<ApiResponse<IDeleteGoalRequestDTO>>> {
		const { id } = request.body;

		try {
			// Execute the use case to delete the goal
			await this.deleteGoalUseCase.execute({ id });

			// Return a success response
			const responseBody = ApiResponse.success(
				{},
				"Goal deleted successfully"
			);

			return response.status(200).json(responseBody);
		} catch (err) {
			next(err);
		}
	}
}
