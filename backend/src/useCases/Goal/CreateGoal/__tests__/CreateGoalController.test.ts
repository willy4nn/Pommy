import request from "supertest";
import { app } from "../../../../app";
import { pool } from "../../../../config/db";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

describe("CreateGoalController (Integration Test)", () => {
	let userId: string;
	let token: string;
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
	});

	afterAll(async () => {
		// Clean up the test user
		const response = await request(app)
			.delete("/users")
			.set("Authorization", `Bearer ${token}`);
		expect(response.status).toBe(200);
		await pool.end();
	});

	describe("Successful Goal Creation", () => {
		it("should create a new goal successfully", async () => {
			const goalData = {
				title: "New Goal",
				description: "Description of the goal",
			};

			const response = await request(app)
				.post("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(goalData);

			expect(response.status).toBe(201);
			expect(response.body.status).toBe("success");
			expect(response.body.message).toBe("Goal created successfully");
			expect(response.body.data).toEqual(
				expect.objectContaining({
					id: expect.stringMatching(
						/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
					),
					title: goalData.title,
					description: goalData.description,
					created_at: expect.any(String),
					updated_at: expect.any(String),
				})
			);
		});
	});

	describe("Validation Error Cases", () => {
		it("should return 400 if title is missing", async () => {
			const goalData = { description: "Goal without a title" };

			const response = await request(app)
				.post("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(goalData);

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.VALIDATION.TITLE_REQUIRED
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

		it("should return 400 if description is missing", async () => {
			const goalData = { title: "Goal without description" };

			const response = await request(app)
				.post("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(goalData);

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.VALIDATION.DESCRIPTION_REQUIRED
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

		it("should return 400 if description is too short", async () => {
			const goalData = { title: "Short Goal", description: "Short" };

			const response = await request(app)
				.post("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(goalData);

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.VALIDATION.INVALID_DESCRIPTION_LENGTH
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

		it("should return 400 if title is too short", async () => {
			const goalData = {
				title: "Go",
				description: "Valid description for this goal",
			};

			const response = await request(app)
				.post("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(goalData);

			const error = new CustomError(
				ErrorCatalog.ERROR.GOAL.VALIDATION.INVALID_TITLE_LENGTH
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

	describe("Authentication Error Cases", () => {
		it("should return 401 if token is missing", async () => {
			const goalData = {
				title: "New Goal",
				description: "Description of the goal",
			};

			const response = await request(app).post("/goals").send(goalData);
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
			const goalData = {
				title: "New Goal",
				description: "Description of the goal",
			};

			const response = await request(app)
				.post("/goals")
				.set("Authorization", "Bearer invalidtoken")
				.send(goalData);
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

	it("should return 400 if goal limit is reached", async () => {
		// Clear all goals for the user before this test
		await pool.query("DELETE FROM goals WHERE user_id = $1", [userId]);

		// Create 5 goals
		for (let i = 0; i < 5; i++) {
			const goalData = {
				title: `Goal ${i + 1}`,
				description: `Description for goal ${i + 1}`,
			};

			const response = await request(app)
				.post("/goals")
				.set("Authorization", `Bearer ${token}`)
				.send(goalData);

			expect(response.status).toBe(201);
		}

		// Now try to create the 6th goal, which should fail due to the limit
		const goalData = {
			title: "Goal 6",
			description: "Description for goal 6",
		};

		const response = await request(app)
			.post("/goals")
			.set("Authorization", `Bearer ${token}`)
			.send(goalData);

		// The expected error is a 400, since the limit was reached
		const error = new CustomError(
			ErrorCatalog.ERROR.GOAL.SERVICE.GOAL_LIMIT_REACHED
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
