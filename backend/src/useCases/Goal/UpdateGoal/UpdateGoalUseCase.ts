import { Goal } from "../../../entities/Goal/Goal";
import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { IGoalsRepository } from "../../../repositories/Goals/IGoalsRepository";
import { IUpdateGoalRequestDTO, IUpdateGoalResponseDTO } from "./UpdateGoalDTO";
import { updateGoalValidator } from "./UpdateGoalValidator";

export class UpdateGoalUseCase {
	constructor(private goalsRepository: IGoalsRepository) {}

	async execute(
		data: IUpdateGoalRequestDTO
	): Promise<IUpdateGoalResponseDTO> {
		// Validate the update data
		updateGoalValidator(data);

		// Find the existing goal in the repository
		const existingGoal = await this.goalsRepository.findById(data.id);

		if (!existingGoal) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.SERVICE.GOAL_NOT_FOUND
			);
		}

		// Create a new Goal instance with the updated data
		const updatedGoal = new Goal(
			{
				title: data.title ? data.title : existingGoal.title,
				description: data.description
					? data.description
					: existingGoal.description,
				user_id: existingGoal.id,
			},
			data.id, // Keeps the same ID
			existingGoal.createdAt, // Keeps the same createdAt
			new Date() // Sets the new updatedAt
		);

		await this.goalsRepository.update(updatedGoal);

		// Return the response DTO with the updated goal data
		return {
			id: updatedGoal.id,
			title: updatedGoal.title,
			description: updatedGoal.description,
			created_at: updatedGoal.createdAt.toISOString(),
			updated_at: updatedGoal.updatedAt.toISOString(),
		};
	}
}
