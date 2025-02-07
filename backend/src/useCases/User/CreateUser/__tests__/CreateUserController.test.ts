import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { CreateUserController } from "../CreateUserController";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { PostgresUsersRepository } from "../../../../repositories/implementations/PostgresUsersRepository";
import { pool } from "../../../../config/db";
import { ApiResponse } from "../../../../helpers/ApiResponse";

describe("Integration: CreateUserController with real database", () => {
	let app: express.Express;
	let controller: CreateUserController;

	beforeAll(() => {
		const usersRepository = new PostgresUsersRepository();
		const createUserUseCase = new CreateUserUseCase(usersRepository);
		controller = new CreateUserController(createUserUseCase);

		app = express();
		app.use(express.json());
		// Route passing the 3 parameters: req, res, and next
		app.post("/users", (req, res, next) =>
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
	});

	afterEach(async () => {
		// Cleans up the data created during the test
		await pool.query("DELETE FROM users");
	});

	afterAll(async () => {
		// Closes the database connection
		await pool.end();
	});

	it("should create a user and return 201 with the data", async () => {
		const userData = {
			name: "John Doe",
			email: "john@example.com",
			password: "Secret123!", // Valid password according to the rules
		};

		const response = await request(app).post("/users").send(userData);

		expect(response.status).toBe(201);

		// Verifies the structure of the standardized response
		expect(response.body).toEqual(
			expect.objectContaining({
				status: "success",
				message: "User created successfully",
				data: expect.objectContaining({
					id: expect.any(String),
					name: userData.name,
					email: userData.email,
					created_at: expect.any(String),
					updated_at: expect.any(String),
				}),
			})
		);
	});

	it("should return 409 if the user already exists", async () => {
		const userData = {
			name: "Jane Doe",
			email: "jane@example.com",
			password: "Secret123!", // Valid password
		};

		// Creates the user once
		await request(app).post("/users").send(userData);
		// Tries to create again with the same email
		const response = await request(app).post("/users").send(userData);

		expect(response.status).toBe(409);

		// Expects the error object to be:
		// { status: "error", message: "User already exists", errorName: "USER_ALREADY_EXISTS", details: "" }
		expect(response.body).toEqual({
			status: "error",
			message: "User already exists",
			errorName: "USER_ALREADY_EXISTS",
			details: "",
		});
	});
});
