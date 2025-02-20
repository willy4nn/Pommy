import { PostgresUsersRepository } from "../../../repositories/implementations/PostgresUsersRepository";
import { DeleteUserController } from "./DeleteUserController";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

// Instantiate the repository for user operations
const postgresUsersRepository = new PostgresUsersRepository();

// Instantiate the use case with the repository dependency
const deleteUserUseCase = new DeleteUserUseCase(postgresUsersRepository);

// Instantiate the controller with the use case dependency
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export { deleteUserUseCase, deleteUserController };
