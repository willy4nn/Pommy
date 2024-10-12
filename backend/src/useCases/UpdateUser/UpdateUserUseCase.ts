import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "../CreateUser/CreateUserDTO";

export class UpdateUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(data: ICreateUserRequestDTO) {
		const userExists = await this.usersRepository.findByEmail(data.email);

		if (!userExists) {
			throw new Error("User does not exist");
		}

		console.log(userExists);

		const user = new User(data);

		await this.usersRepository.update(user);
	}
}
