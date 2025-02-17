import { PostgresUsersRepository } from "../../../repositories/implementations/PostgresUsersRepository";
import { UpdateUserController } from "./UpdateUserController";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

// Instantiate the repository for user operations
const postgresUsersRepository = new PostgresUsersRepository();

// Instantiate the use case with the repository dependency
const updateUserUseCase = new UpdateUserUseCase(postgresUsersRepository);

// Instantiate the controller with the use case dependency
const updateUserController = new UpdateUserController(updateUserUseCase);

export { updateUserUseCase, updateUserController };
