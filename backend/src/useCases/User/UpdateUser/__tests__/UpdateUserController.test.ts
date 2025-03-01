import request from "supertest";
import { app } from "../../../../app";
import { pool } from "../../../../config/db";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

describe("UpdateUserController (Integration Test)", () => {
	let authToken: string;

	beforeAll(async () => {
		// Create user and login to get a valid token
		await request(app).post("/users").send({
			name: "Test User",
			email: "testuser@user.com",
			password: "TestPassword123@",
		});

		const loginResponse = await request(app).post("/login").send({
			email: "testuser@user.com",
			password: "TestPassword123@",
		});
		authToken = loginResponse.body.data.token;
	});

	afterAll(async () => {
		await pool.query("DELETE FROM users");
		await pool.end();
	});

	describe("Successful Update", () => {
		it("should update the user successfully", async () => {
			const updateData = {
				name: "Updated Test User",
				email: "updatedtestuser@user.com",
				password: "NewTestPassword123@",
			};

			const response = await request(app)
				.put("/users")
				.set("Authorization", `Bearer ${authToken}`)
				.send(updateData);

			expect(response.status).toBe(200);
			expect(response.body.status).toBe("success");
			expect(response.body.message).toBe("User updated successfully");
			expect(response.body.data).toEqual(
				expect.objectContaining({
					id: expect.any(String),
					name: updateData.name,
					email: updateData.email,
					created_at: expect.any(String),
					updated_at: expect.any(String),
				})
			);
		});
	});

	describe("Error Cases", () => {
		it("should return 401 if token is missing", async () => {
			const updateData = {
				name: "Updated Test User",
				email: "updatedtestuser@user.com",
				password: "NewTestPassword123@",
			};

			const response = await request(app).put("/users").send(updateData);

			const error = new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.NO_TOKEN_PROVIDED
			);

			expect(response.status).toBe(error.statusCode);
			expect(response.body).toEqual(
				expect.objectContaining({
					status: "error",
					message: error.message,
					errorName: error.errorName,
				})
			);
		});

		it("should return 401 if token is invalid", async () => {
			const updateData = {
				name: "Updated Test User",
				email: "updatedtestuser@user.com",
				password: "NewTestPassword123@",
			};

			const response = await request(app)
				.put("/users")
				.set("Authorization", "Bearer invalidtoken")
				.send(updateData);

			const error = new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_OR_EXPIRED_TOKEN
			);

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
});
