import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "../CreateUser/CreateUserDTO";

export class UpdateUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(id: string, data: ICreateUserRequestDTO) {
		const userExists = await this.usersRepository.findById(id);

		if (!userExists) {
			throw new Error("User does not exist");
		}

		const updatedUser = {
			...userExists,
			...(data.name && { name: data.name }),
			...(data.email && { email: data.email }),
			...(data.password && { password: data.password }),
		};

		await this.usersRepository.update(updatedUser);
	}
}
