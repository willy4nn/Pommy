import { PostgresGoalsRepository } from "../../../repositories/Goals/implementations/PostgresGoalsRepository";
import { CreateGoalController } from "./CreateGoalController";
import { CreateGoalUseCase } from "./CreateGoalUseCase";

// Instantiate the repository for goals operations
const postgresGoalsRepository = new PostgresGoalsRepository();

// Instantiate the use case with the repository dependency
const createGoalUseCase = new CreateGoalUseCase(postgresGoalsRepository);

// Instantiate the controller with the use case dependency
const createGoalController = new CreateGoalController(createGoalUseCase);

export { createGoalUseCase, createGoalController };
