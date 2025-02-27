import request from "supertest";
import { pool } from "../../../../config/db";
import { app } from "../../../../app";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

describe("DELETE /users", () => {
	const userEmail = "testuser@example.com";
	let token: string;

	// Before each test, create a fixed user and perform login to obtain the token
	beforeEach(async () => {
		await request(app).post("/users").send({
			name: "Test User",
			email: userEmail,
			password: "Password123@",
		});

		const loginResponse = await request(app).post("/login").send({
			email: userEmail,
			password: "Password123@",
		});

		token = loginResponse.body.data.token;
	});

	// After each test, remove the created user
	afterEach(async () => {
		await pool.query("DELETE FROM users WHERE email = $1", [userEmail]);
	});

	// After all tests, close the connection pool
	afterAll(async () => {
		await pool.end();
	});

	it("should return 401 when no token is provided", async () => {
		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
		);

		// Test the DELETE route without providing a token
		const response = await request(app).delete("/users");

		// Error comparisons
		expect(response.status).toBe(error.statusCode);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
		expect(response.body.errorName).toBe(error.errorName);
		expect(response.body.statusCode).toBe(error.statusCode);
	});

	it("should return 401 when the token is invalid or expired", async () => {
		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
		);

		// Test the DELETE route with an invalid token
		const response = await request(app)
			.delete("/users")
			.set("Authorization", "Bearer invalid_token");

		// Error comparisons
		expect(response.status).toBe(error.statusCode);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
		expect(response.body.errorName).toBe(error.errorName);
		expect(response.body.statusCode).toBe(error.statusCode);
	});

	it("should return 404 if user not found", async () => {
		// Directly delete the user to simulate that it does not exist
		await pool.query("DELETE FROM users WHERE email = $1", [userEmail]);

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND
		);

		// Test the DELETE route with a valid token, but with no user in the database
		const response = await request(app)
			.delete("/users")
			.set("Authorization", `Bearer ${token}`);

		// Error comparisons
		expect(response.status).toBe(error.statusCode);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
		expect(response.body.errorName).toBe(error.errorName);
		expect(response.body.statusCode).toBe(error.statusCode);
	});

	it("should delete the user and return success", async () => {
		// Test deleting the user using a valid token
		const response = await request(app)
			.delete("/users")
			.set("Authorization", `Bearer ${token}`);

		expect(response.status).toBe(200);
		expect(response.body).toEqual({
			status: "success",
			message: "User deleted successfully",
			data: {},
		});
	});
});
