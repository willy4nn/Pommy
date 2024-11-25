import { User } from "../../../entities/User";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { ICreateUserRequestDTO, ICreateUserResponseDTO } from "./CreateUserDTO";
import bcrypt from "bcryptjs";

export class CreateUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(
		data: ICreateUserRequestDTO
	): Promise<ICreateUserResponseDTO> {
		// Check if user already exists by email
		const userAlreadyExists = await this.usersRepository.findByEmail(
			data.email.toLowerCase()
		);

		if (userAlreadyExists) {
			throw new Error("The user already exists");
		}

		// Clean up name and email
		const name = data.name.trim().replace(/\s+/g, " "); // Remove extra spaces
		const email = data.email.toLowerCase(); // Convert email to lowercase

		// Hash the password
		const hashedPassword = await bcrypt.hash(data.password, 10);

		// Create a new user instance with transformed data
		const user = new User({
			name,
			email,
			password: hashedPassword,
		});

		// Save the user in the repository
		await this.usersRepository.save(user);

		// Prepare response with essential user details
		const userResponse: ICreateUserResponseDTO = {
			id: user.id,
			name: user.name,
			email: user.email,
			created_at: user.createdAt.toISOString(),
		};

		return userResponse;
	}
}
