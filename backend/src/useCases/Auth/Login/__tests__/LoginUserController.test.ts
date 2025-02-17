import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { LoginUserController } from "../LoginUserController";
import { LoginUserUseCase } from "../LoginUserUseCase";
import { PostgresUsersRepository } from "../../../../repositories/implementations/PostgresUsersRepository";
import { pool } from "../../../../config/db";
import { User } from "../../../../entities/User";

describe("Integration: LoginUserController with real database", () => {
	let app: express.Express;
	let controller: LoginUserController;

	beforeEach(async () => {
		// Clears the users table before each test
		await pool.query("DELETE FROM users");

		// Instantiates the real repository
		const usersRepository = new PostgresUsersRepository();
		const loginUserUseCase = new LoginUserUseCase(usersRepository);
		controller = new LoginUserController(loginUserUseCase);

		// Sets up the express app with the login route
		app = express();
		app.use(express.json());

		// Middleware to clear cookies before handling requests
		app.use((req, res, next) => {
			res.clearCookie("token");
			next();
		});

		app.post("/login", (req, res, next) =>
			controller.handle(req, res, next)
		);

		// Error handling middleware
		app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			res.status(err.statusCode || 500).json({
				status: "error",
				message: err.message,
				errorName: err.errorName || "",
				details: err.details || "",
			});
		});

		// Creates a new user using the real repository
		const hashedPassword = await bcrypt.hash("password123", 10);
		const user = new User({
			name: "Test User",
			email: "test@example.com", // Ensure the email matches the one used in the tests
			password: hashedPassword,
		});
		await usersRepository.save(user); // Inserts the user into the database
	});

	afterAll(async () => {
		// Clears the users table and closes the database connection
		await pool.query("DELETE FROM users");
		await pool.end();
	});

	it("should login successfully and return 201 with token and set cookie", async () => {
		const response = await request(app)
			.post("/login")
			.send({ email: "test@example.com", password: "password123" });

		expect(response.status).toBe(201);
		expect(response.body).toEqual(
			expect.objectContaining({
				status: "success",
				message: "User logged in successfully!",
				data: expect.any(String), // Token generated
			})
		);

		// Verifies if the token cookie was set
		const setCookieHeader = response.header["set-cookie"];
		let cookies: string[] = [];
		if (Array.isArray(setCookieHeader)) {
			cookies = setCookieHeader;
		} else if (typeof setCookieHeader === "string") {
			cookies = [setCookieHeader];
		}
		expect(cookies.some((cookie) => cookie.includes("token="))).toBe(true);
	});

	it("should return 401 error for invalid credentials", async () => {
		const response = await request(app)
			.post("/login")
			.send({ email: "test@example.com", password: "wrongpassword" });

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			status: "error",
			message: "Invalid credentials",
			errorName: "INVALID_CREDENTIALS",
			details: "",
		});
	});
});
