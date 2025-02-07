import request from "supertest";
import express from "express";
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
		app.post("/users", (req, res) => controller.handle(req, res));
	});

	afterEach(async () => {
		// Clear data created during the test
		await pool.query("DELETE FROM users");
	});

	afterAll(async () => {
		// Close the database connection
		await pool.end();
	});

	it("should create a user and return 201 with the data", async () => {
		const userData = {
			name: "John Doe",
			email: "john@example.com",
			password: "secret",
		};

		const response = await request(app).post("/users").send(userData);

		expect(response.status).toBe(201);

		// Verificar a estrutura da resposta padronizada
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

	it("should return 500 if the user already exists", async () => {
		const userData = {
			name: "Jane Doe",
			email: "jane@example.com",
			password: "secret",
		};

		// Create the user once
		await request(app).post("/users").send(userData);
		// Try to create again with the same email
		const response = await request(app).post("/users").send(userData);

		expect(response.status).toBe(500);

		// Verificar a estrutura da resposta de erro padronizada
		expect(response.body).toEqual(
			ApiResponse.error(500, "The user already exists", "Error")
		);
	});
});
