import request from "supertest";
import { app } from "../../../../app";
import { pool } from "../../../../config/db";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

describe("Integration: CreateUserController with real database", () => {
	afterEach(async () => {
		await pool.query("DELETE FROM users");
	});

	afterAll(async () => {
		await pool.query("DELETE FROM users");
		await pool.end();
	});

	it("should create a user and return 201 with the data", async () => {
		const userData = {
			name: "John Doe",
			email: "john@example.com",
			password: "Secret123!",
		};

		const response = await request(app).post("/users").send(userData);

		// Expect 201 status and validate response data
		expect(response.status).toBe(201);
		expect(response.body.status).toBe("success");
		expect(response.body.message).toBe("User created successfully");
		expect(response.body.data).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				name: userData.name,
				email: userData.email,
				created_at: expect.any(String),
				updated_at: expect.any(String),
			})
		);
	});

	it("should return 409 if the user already exists", async () => {
		const userData = {
			name: "Jane Doe",
			email: "jane@example.com",
			password: "Secret123!",
		};

		// Create the user first
		await request(app).post("/users").send(userData);
		// Try creating the same user again
		const response = await request(app).post("/users").send(userData);

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.SERVICE.USER_ALREADY_EXISTS
		);

		// Expect 409 status and match the error response
		expect(response.status).toBe(error.statusCode);
		expect(response.body).toEqual(
			expect.objectContaining({
				status: "error",
				message: error.message,
				errorName: error.errorName,
			})
		);
	});
});
