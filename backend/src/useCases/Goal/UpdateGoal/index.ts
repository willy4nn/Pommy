import { PostgresGoalsRepository } from "../../../repositories/Goals/implementations/PostgresGoalsRepository";
import { UpdateGoalUseCase } from "./UpdateGoalUseCase";
import { UpdateGoalController } from "./UpdateGoalController";

// Instantiate the repository for goals operations
const postgresGoalsRepository = new PostgresGoalsRepository();

// Instantiate the use case with the repository dependency
const updateGoalUseCase = new UpdateGoalUseCase(postgresGoalsRepository);

// Instantiate the controller with the use case dependency
const updateGoalController = new UpdateGoalController(updateGoalUseCase);

export { updateGoalController, updateGoalUseCase };
