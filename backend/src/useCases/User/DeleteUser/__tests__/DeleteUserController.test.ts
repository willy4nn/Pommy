import request from "supertest";
import { pool } from "../../../../config/db";
import { app } from "../../../../app";
import { ErrorCatalog } from "../../../../errors/CustomError";

describe("DELETE /users", () => {
	let token: string;

	beforeAll(async () => {
		// Logout if a user is already logged in (optional, based on your implementation)
		await request(app).post("/logout");

		// Create a user for testing
		const response = await request(app).post("/users").send({
			name: "Test User",
			email: "testuser@example.com",
			password: "Password123@",
		});

		// Login to get the token for authorization
		const loginResponse = await request(app).post("/login").send({
			email: "testuser@example.com",
			password: "Password123@",
		});

		token = loginResponse.body.data;
	});

	it("should return 401 when no token is provided", async () => {
		// Test case where no token is provided in the request
		const response = await request(app).delete("/users");

		expect(response.status).toBe(401);
		expect(response.body).toEqual({
			status: "error",
			message:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
					.message,
			errorName:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
					.errorName,
			statusCode:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
					.statusCode,
		});
	});

	it("should delete the user and return success", async () => {
		// Test case for successful deletion of user with valid token
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

	afterAll(async () => {
		// Cleanup: remove the test user from the database
		await pool.query("DELETE FROM users WHERE email = $1", [
			"testuser@example.com",
		]);
		await pool.end();
	});
});
