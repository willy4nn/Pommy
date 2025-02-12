import { User } from "../../../entities/User";
import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { IUpdateUserRequestDTO, IUpdateUserResponseDTO } from "./UpdateUserDTO";
import { updateUserValidator } from "./UpdateUserValidator";
import bcrypt from "bcrypt";

export class UpdateUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(
		data: IUpdateUserRequestDTO
	): Promise<IUpdateUserResponseDTO> {
		// Validate the user data before processing
		updateUserValidator(data);

		// Check if the user exists by ID
		const userExists = await this.usersRepository.findById(data.id);

		// If the user doesn't exist, throw an error
		if (!userExists) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND
			);
		}

		// Update user fields, using provided data or retaining existing values
		const name = data.name
			? data.name.trim().replace(/\s+/g, " ") // Remove extra spaces from the name
			: userExists.name;
		const email = data.email ? data.email.toLowerCase() : userExists.email; // Ensure email is in lowercase
		const password = data.password
			? await bcrypt.hash(data.password, 10) // Hash the new password if provided
			: userExists.password;

		// Create a user entity with updated data
		const user = new User(
			{
				name,
				email,
				password,
			},
			data.id
		);

		// Save the updated user in the repository
		await this.usersRepository.update(user);

		// Prepare response data with updated user details
		const userResponse: IUpdateUserResponseDTO = {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: userExists.createdAt.toISOString(),
			updated_at: userExists.updatedAt.toDateString(),
		};

		// Return the updated user response
		return userResponse;
	}
}
