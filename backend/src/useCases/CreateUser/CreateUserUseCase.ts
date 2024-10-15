import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";
import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { hashPassword } from '../../utils/passwordUtils'

export class CreateUserUseCase {
	constructor(
		private usersRepository: IUsersRepository,
		private mailProvider: IMailProvider
	) {}

	async execute(data: ICreateUserRequestDTO) {
		const userAlreadyExists = await this.usersRepository.findByEmail(
			data.email
		);

		if (userAlreadyExists) {
			throw new Error("User already exists.");
		}

		const hashedPassword = await hashPassword(data.password);

		const user = new User({
			...data,
			password: hashedPassword,
		});

		await this.usersRepository.save(user);

		await this.mailProvider.sendMail({
			to: {
				name: data.name,
				email: data.email,
			},
			from: {
				name: "Equipe Pommy",
				email: "equipe@pommy.com",
			},
			subject: "Seja Bem-Vindo ao Pommy",
			body: `<p>Você já pode aproveitar o Pommy</p>`,
		});
	}
}
