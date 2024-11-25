import { PostgresUsersRepository } from "../../../repositories/implementations/PostgresUsersRepository";
import { CreateUserController } from "./CreateUserController";
import { CreateUserUseCase } from "./CreateUserUseCase";

// Instantiate the repository for user operations
const postgresUsersRepository = new PostgresUsersRepository();

// Instantiate the use case with the repository dependency
const createUserUseCase = new CreateUserUseCase(postgresUsersRepository);

// Instantiate the controller with the use case dependency
const createUserController = new CreateUserController(createUserUseCase);

export { createUserUseCase, createUserController };
