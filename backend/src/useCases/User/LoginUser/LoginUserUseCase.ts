import { CustomError, ErrorCatalog } from "../../../errors/CustomError";
import { generateToken } from "../../../helpers/generateToken";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { ILoginUserRequestDTO } from "./LoginUserDTO";
import bcrypt from "bcryptjs";

export class LoginUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(data: ILoginUserRequestDTO) {
		// Check if the user exists by email
		const userExists = await this.usersRepository.findByEmail(data.email);

		// If the user doesn't exist, throw a "User Not Found" error
		if (!userExists) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND
			);
		}

		// Compare the provided password with the stored hashed password
		const isPasswordValid = await bcrypt.compare(
			data.password,
			userExists.password
		);

		// If the password is invalid, throw an "Invalid Password" error
		if (!isPasswordValid) {
			throw new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_PASSWORD
			);
		}

		// Generate a token for the authenticated user
		const token = generateToken(userExists.id);

		// Return the generated token
		return token;
	}
}
