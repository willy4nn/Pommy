import { PostgresUsersRepository } from "../../repositories/implementations/PostgresUsersRepository";
import { DeleteUserController } from "./DeleteUserController";
import { DeleteUserUseCase } from "./DeleteUserUseCase";

const postgesUsersRepository = new PostgresUsersRepository();

const deleteUserUseCase = new DeleteUserUseCase(postgesUsersRepository);
const deleteUserController = new DeleteUserController(deleteUserUseCase);

export { deleteUserUseCase, deleteUserController };
