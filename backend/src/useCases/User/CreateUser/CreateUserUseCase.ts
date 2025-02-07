import { User } from "../../../entities/User";
import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { ICreateUserRequestDTO, ICreateUserResponseDTO } from "./CreateUserDTO";
import bcrypt from "bcrypt";
import { createUserValidator } from "./CreateUserValidator";

export class CreateUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(
		data: ICreateUserRequestDTO
	): Promise<ICreateUserResponseDTO> {
		// Calls the function to validate user creation data
		createUserValidator(data);

		// Check if a user already exists with the provided email
		const userAlreadyExists = await this.usersRepository.findByEmail(
			data.email.toLowerCase()
		);

		// If the user already exists, throw an error
		if (userAlreadyExists) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.SERVICE.USER_ALREADY_EXISTS
			);
		}

		// Clean up the name and email fields to ensure proper formatting
		const name = data.name.trim().replace(/\s+/g, " ");
		const email = data.email.trim().toLowerCase();

		// Hash the password for secure storage
		const hashedPassword = await bcrypt.hash(data.password, 10);

		// Create a new user instance with sanitized data
		const user = new User({
			name,
			email,
			password: hashedPassword,
		});

		// Save the newly created user into the database
		await this.usersRepository.save(user);

		// Prepare the response DTO with essential user details
		const userResponse: ICreateUserResponseDTO = {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: user.createdAt.toISOString(),
			updated_at: user.updatedAt.toISOString(),
		};

		// Return the created user details
		return userResponse;
	}
}
