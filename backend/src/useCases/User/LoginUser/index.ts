import { PostgresUsersRepository } from "../../../repositories/implementations/PostgresUsersRepository";
import { LoginUserController } from "./LoginUserController";
import { LoginUserUseCase } from "./LoginUserUseCase";

const postgresUsersRepository = new PostgresUsersRepository();

const loginUserUseCase = new LoginUserUseCase(postgresUsersRepository);

const loginUserController = new LoginUserController(loginUserUseCase);

export { loginUserUseCase, loginUserController };
