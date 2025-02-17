import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { IDeleteUserRequestDTO } from "./DeleteUserDTO";
import { deleteUserValidator } from "./DeleteUserValidator";

export class DeleteUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(data: IDeleteUserRequestDTO) {
		// Validates the passed information
		deleteUserValidator(data);

		// Checks if the user exists by ID
		const userExists = await this.usersRepository.findById(data.id);

		// If not exists, throws an error
		if (!userExists) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND
			);
		}

		// Deletes the user
		await this.usersRepository.delete(data.id);
	}
}
