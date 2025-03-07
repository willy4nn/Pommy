import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { IGoalsRepository } from "../../../repositories/Goals/IGoalsRepository";
import { IDeleteGoalRequestDTO } from "./DeleteGoalDTO";
import { deleteGoalValidator } from "./DeleteGoalValidator";

export class DeleteGoalUseCase {
	constructor(private goalsRepository: IGoalsRepository) {}

	async execute(data: IDeleteGoalRequestDTO) {
		// Validates the passed information
		deleteGoalValidator(data);

		// Checks if the goal exists by ID
		const goalExists = await this.goalsRepository.findById(data.id);

		// If not exists, throws an error
		if (!goalExists) {
			throw new CustomError(
				ErrorCatalog.ERROR.GOAL.SERVICE.GOAL_NOT_FOUND
			);
		}

		// Deletes the goal
		await this.goalsRepository.delete(data.id);
	}
}
