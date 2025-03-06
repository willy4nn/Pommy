import { Goal } from "../../../entities/Goal/Goal";
import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { IGoalsRepository } from "../../../repositories/Goals/IGoalsRepository";
import { ICreateGoalRequestDTO, ICreateGoalResponseDTO } from "./CreateGoalDTO";
import { createGoalValidator } from "./CreateGoalValidator";

export class CreateGoalUseCase {
	constructor(private goalsRepository: IGoalsRepository) {}

	async execute(
		data: ICreateGoalRequestDTO
	): Promise<ICreateGoalResponseDTO> {
		// Calls the function to validate goal creation data
		createGoalValidator(data);

		// Maximum number of goals allowed per user
		const MAX_GOAL_LIMIT = 5;

		// Get the current count of goals for the user
		const existingGoalsCount = await this.goalsRepository.countByUserId(
			data.user_id
		);

		// If the user has already reached the maximum goal limit, throw an error
		if (existingGoalsCount >= MAX_GOAL_LIMIT) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.SERVICE.GOAL_LIMIT_REACHED
			);
		}

		// Create a new goal using the provided data
		const goal = new Goal(data);

		// Save the newly created goal into the database
		await this.goalsRepository.save(goal);

		// Prepare the response DTO with essential goal details
		return {
			id: goal.id,
			title: goal.title,
			description: goal.description,
			created_at: goal.createdAt.toISOString(),
			updated_at: goal.updatedAt.toISOString(),
		};
	}
}
