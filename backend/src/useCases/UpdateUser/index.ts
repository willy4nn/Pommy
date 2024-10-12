import { PostgresUsersRepository } from "../../repositories/implementations/PostgresUsersRepository";
import { UpdateUserController } from "./UpdateUserController";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

const postgesUsersRepository = new PostgresUsersRepository();

const updateUserUseCase = new UpdateUserUseCase(postgesUsersRepository);
const updateUserController = new UpdateUserController(updateUserUseCase);

export { updateUserUseCase, updateUserController };
