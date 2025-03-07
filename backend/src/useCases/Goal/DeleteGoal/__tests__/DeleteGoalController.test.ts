import request from "supertest";
import { app } from "../../../../app";
import { pool } from "../../../../config/db";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { v4 as uuidv4 } from "uuid";

describe("DeleteGoalController (Integration Test)", () => {
	let userId: string;
	let token: string;
	let goalId: string;
	const testEmail = "testuser@user.com";

	beforeAll(async () => {
		// Create test user and login
		const userResponse = await request(app).post("/users").send({
			name: "Test User",
			email: testEmail,
			password: "TestPassword123@",
		});
		expect(userResponse.status).toBe(201);
		userId = userResponse.body.data.id;

		const loginResponse = await request(app).post("/login").send({
			email: testEmail,
			password: "TestPassword123@",
		});
		token = loginResponse.body.data.token;

		// Create a goal to delete later
		const goalResponse = await request(app)
			.post("/goals")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Goal to Delete",
				description: "This goal will be deleted in the test",
			});
		expect(goalResponse.status).toBe(201);
		goalId = goalResponse.body.data.id;
	});

	afterAll(async () => {
		// Clean up the test user and close the database pool
		const response = await request(app)
			.delete("/users")
			.set("Authorization", `Bearer ${token}`);
		expect(response.status).toBe(200);
		await pool.end();
	});

	describe("Successful Goal Deletion", () => {
		it("should delete an existing goal successfully", async () => {
			const deleteData = { id: goalId };

			const response = await request(app)
				.delete("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(deleteData);

			expect(response.status).toBe(200);
			expect(response.body.status).toBe("success");
			expect(response.body.message).toBe("Goal deleted successfully");
			expect(response.body.data).toEqual({});
		});
	});

	describe("Error Cases", () => {
		it("should return 401 if token is missing", async () => {
			const deleteData = { id: goalId };

			const response = await request(app)
				.delete("/goals")
				.send(deleteData);

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
			const deleteData = { id: goalId };

			const response = await request(app)
				.delete("/goals")
				.set("Authorization", "Bearer invalidtoken")
				.send(deleteData);

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

		it("should return 404 if goal does not exist", async () => {
			const nonExistentGoalId = uuidv4();
			const deleteData = { id: nonExistentGoalId };

			const response = await request(app)
				.delete("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(deleteData);

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.SERVICE.GOAL_NOT_FOUND
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

		it("should return 400 if id is invalid", async () => {
			const invalidIdData = { id: "" };

			const response = await request(app)
				.delete("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(invalidIdData);

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.VALIDATION.GOAL_ID_REQUIRED
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
