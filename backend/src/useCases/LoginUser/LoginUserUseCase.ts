import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ILoginUserRequestDTO } from "./LoginUserDTO";
import { verifyPassword } from "../../utils/passwordUtils";
import { generateToken } from "../../utils/generateJWT";

export class LoginUserUseCase {
	constructor(private usersRepository: IUsersRepository) {}

	async execute(data: ILoginUserRequestDTO) {
		const user = await this.usersRepository.findByEmail(data.email);

		if (!user) {
			throw new Error("User does not exist");
		}

		const isPasswordValid = await verifyPassword(
			data.password,
			user.password
		);

		if (!isPasswordValid) {
			throw new Error("Invalid password");
		}

		const token = generateToken(user.id, user.email);
		return token;
	}
}
