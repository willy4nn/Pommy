import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { IDeleteUserRequestDTO } from "./DeleteUserDTO";
import { deleteUserValidator } from "./DeleteUserValidator";

export class DeleteUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(data: IDeleteUserRequestDTO): Promise<void> {
		// Validate the user data before processing
		deleteUserValidator(data);

		// Check if the user exists by ID
		const userExists = await this.usersRepository.findById(data.id);

		// If the user doesn't exist, throw an error
		if (!userExists) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND
			);
		}

		// Delete the user from the repository
		await this.usersRepository.delete(data.id);
	}
}
