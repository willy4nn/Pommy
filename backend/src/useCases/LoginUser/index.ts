import { PostgresUsersRepository } from "../../repositories/implementations/PostgresUsersRepository";
import { LoginUserController } from "./LoginUserController";
import { LoginUserUseCase } from "./LoginUserUseCase";

const postgesUsersRepository = new PostgresUsersRepository();

const loginUserUseCase = new LoginUserUseCase(postgesUsersRepository);
const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserUseCase, loginUserController };
