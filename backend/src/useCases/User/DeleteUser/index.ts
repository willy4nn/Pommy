import { PostgresUsersRepository } from "../../../repositories/implementations/PostgresUsersRepository";
import { DeleteUserController } from "./DeleteUserController";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

const postgresUsersRepository = new PostgresUsersRepository();

const deleteUserUseCase = new DeleteUserUseCase(postgresUsersRepository);

const deleteUserController = new DeleteUserController(deleteUserUseCase);

export { deleteUserUseCase, deleteUserController };
