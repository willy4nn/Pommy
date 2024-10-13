import { IUsersRepository } from "../../repositories/IUsersRepository";
import { IDeleteUserRequestDTO } from "./DeleteUserDTO";

export class DeleteUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(data: IDeleteUserRequestDTO) {
		const user = await this.usersRepository.findByEmail(data.email);

		if (!user) {
			throw new Error("User does not exist");
		}

		await this.usersRepository.delete(data.id);
	}
}
