import request from "supertest";
import { app } from "../../../../app";
import { pool } from "../../../../config/db";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { v4 as uuidv4 } from "uuid";

describe("UpdateGoalController (Integration Test)", () => {
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

		// Create a goal to update later
		const goalResponse = await request(app)
			.post("/goals")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "Original Goal",
				description: "Original Description",
			});

		expect(goalResponse.status).toBe(201);
		goalId = goalResponse.body.data.id;
	});

	afterAll(async () => {
		// Clean up the test user
		const response = await request(app)
			.delete("/users")
			.set("Authorization", `Bearer ${token}`);
		expect(response.status).toBe(200);
		await pool.end();
	});

	describe("Successful Goal Update", () => {
		it("should update an existing goal successfully", async () => {
			const updateData = {
				id: goalId,
				title: "Updated Goal",
				description: "Updated Description",
			};

			const response = await request(app)
				.put("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(updateData);

			expect(response.status).toBe(200);
			expect(response.body.status).toBe("success");
			expect(response.body.message).toBe("Goal updated successfully");
			expect(response.body.data).toEqual(
				expect.objectContaining({
					id: goalId,
					title: updateData.title,
					description: updateData.description,
					created_at: expect.any(String),
					updated_at: expect.any(String),
				})
			);
		});
	});

	describe("Authentication Error Cases", () => {
		it("should return 401 if token is missing", async () => {
			const updateData = {
				id: goalId,
				title: "Updated Goal",
				description: "Updated Description",
			};

			const response = await request(app).put("/goals").send(updateData);
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
				id: goalId,
				title: "Updated Goal",
				description: "Updated Description",
			};

			const response = await request(app)
				.put("/goals")
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

	it("should return 404 if goal does not exist", async () => {
		const nonExistentGoalId = uuidv4();

		const updateData = {
			id: nonExistentGoalId,
			title: "Updated Goal",
			description: "Updated Description",
		};

		const response = await request(app)
			.put("/goals")
			.set("Authorization", `Bearer ${token}`)
			.send(updateData);

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
});
