import request from "supertest";
import { pool } from "../../../../config/db";
import { app } from "../../../../app";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

describe("Integration Tests: LogoutUserController – Validating Token Handling and Session Termination", () => {
	let token: string;

	beforeAll(async () => {
		// Create the test user
		const createUserResponse = await request(app).post("/users").send({
			name: "user",
			email: "test@example.com",
			password: "Password123@",
		});

		expect(createUserResponse.status).toBe(201);

		// Perform login to obtain the token
		const loginResponse = await request(app).post("/login").send({
			email: "test@example.com",
			password: "Password123@",
		});

		expect(loginResponse.status).toBe(201);
		token = loginResponse.body.data.token;
	});

	it("should return an error if no token is provided", async () => {
		// Test case for missing token in the logout request
		const response = await request(app).post("/logout").send();

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
		);

		expect(response.status).toBe(401);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
	});

	it("should return an error if the token is invalid", async () => {
		// Test case for invalid token in the logout request
		const response = await request(app)
			.post("/logout")
			.set("Cookie", "token=invalidToken")
			.send();

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
		);

		expect(response.status).toBe(401);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
	});

	it("should return an error if the user is already logged out or the token is expired", async () => {
		// Test case for expired or invalid token (already logged out)
		const response = await request(app)
			.post("/logout")
			.set("Cookie", "token=expiredOrInvalidToken")
			.send();

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
		);

		expect(response.status).toBe(401);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
	});

	it("should logout the user and clear the token cookie", async () => {
		// Test case for successful logout
		const response = await request(app)
			.post("/logout")
			.set("Cookie", `token=${token}`)
			.send();

		const cookieHeader = response.header["set-cookie"];
		expect(cookieHeader).toEqual(
			expect.arrayContaining([
				expect.stringContaining("token=;"),
				expect.stringContaining(
					"Expires=Thu, 01 Jan 1970 00:00:00 GMT"
				),
				expect.stringContaining("HttpOnly"),
				expect.stringContaining("Secure"),
				expect.stringContaining("SameSite=Strict"),
			])
		);

		expect(response.status).toBe(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				status: "success",
				message: "User logged out successfully!",
			})
		);
	});

	afterAll(async () => {
		// Delete the test user after the tests
		const deleteUserResponse = await request(app)
			.delete("/users")
			.set("Authorization", `Bearer ${token}`);
		expect(deleteUserResponse.status).toBe(200);

		// Close the database connection
		await pool.end();
	});
});
