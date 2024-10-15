import { Request, Response } from "express";
import { LoginUserUseCase } from "./LoginUserUseCase";

export class LoginUserController {
	constructor(private loginUserUseCase: LoginUserUseCase) {}

	async handle(request: Request, response: Response): Promise<Response> {
		const { email, password } = request.body;

		try {
			
			const token = await this.loginUserUseCase.execute({
				email,
				password,
			});

			response.cookie("token", token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 3600000,
			});

			return response.status(200).json({ message: "Login successful" });
		} catch (err) {
			return response.status(400).json({
				message: err.message || "Unexpected error.",
			});
		}
	}
}
