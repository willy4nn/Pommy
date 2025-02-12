import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { generateToken } from "../../../helpers/generateToken";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { ILoginUserRequestDTO } from "./LoginUserDTO";
import bcrypt from "bcrypt";

export class LoginUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(data: ILoginUserRequestDTO) {
		// Check if the email was provided
		if (!data.email) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
			);
		}

		// Check if the password was provided
		if (!data.password) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
			);
		}

		// Check if the user exists by email
		const userExists = await this.usersRepository.findByEmail(data.email);

		// Add a small simulated delay to prevent timing attacks
		await new Promise((resolve) => setTimeout(resolve, 500));

		// If the user doesn't exist, throw an "Invalid Credentials" error
		if (!userExists) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
			);
		}

		// Compare the provided password with the stored hashed password
		const isPasswordValid = await bcrypt.compare(
			data.password,
			userExists.password
		);

		// If the password is invalid, throw an "Invalid Credentials" error
		if (!isPasswordValid) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
			);
		}

		// Generate a token for the authenticated user
		const token = generateToken(userExists.id);

		// Return the generated token
		return token;
	}
}
