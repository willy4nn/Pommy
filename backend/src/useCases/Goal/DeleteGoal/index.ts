import { PostgresGoalsRepository } from "../../../repositories/Goals/implementations/PostgresGoalsRepository";
import { DeleteGoalController } from "./DeleteGoalController";
import { DeleteGoalUseCase } from "./DeleteGoalUseCase";

// Instantiate the repository for goals operations
const postgresGoalsRepository = new PostgresGoalsRepository();

// Instantiate the use case with the repository dependency
const deleteGoalUseCase = new DeleteGoalUseCase(postgresGoalsRepository);

// Instantiate the controller with the use case dependency
const deleteGoalController = new DeleteGoalController(deleteGoalUseCase);

export { deleteGoalUseCase, deleteGoalController };
