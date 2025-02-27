import { Request, Response, NextFunction } from "express";
import { LoginUserUseCase } from "./LoginUserUseCase";
import { ApiResponse } from "../../../helpers/ApiResponse";

export class LoginUserController {
	constructor(private loginUserUseCase: LoginUserUseCase) {}

	async handle(request: Request, response: Response, next: NextFunction) {
		const { email, password } = request.body;

		try {
			// Execute login use case and generate token
			const token = await this.loginUserUseCase.execute({
				email,
				password,
			});

			// Set token in cookie
			response.cookie("token", token, {
				httpOnly: true, // The cookie cannot be accessed via JavaScript
				secure: true, // Always send cookie over HTTPS
				sameSite: "strict", // Properly set as "strict" (in lowercase)
				maxAge: 3600000, // The cookie expires i	n 1 hour (3600000 ms)
				path: "/",
			});

			// Prepare and send the success response
			const responseBody = ApiResponse.success(
				{
					token,
				},
				"User logged in successfully!"
			);

			return response.status(201).json(responseBody);
		} catch (err) {
			next(err);
		}
	}
}
