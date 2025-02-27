import request from "supertest";
import { app } from "../../../../app";
import { pool } from "../../../../config/db";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

describe("LoginUserController", () => {
	let userId: string;
	let token: string;
	const testEmail = "test@example.com";

	beforeAll(async () => {
		// Create a test user before running the login tests
		const response = await request(app).post("/users").send({
			name: "user",
			email: testEmail,
			password: "Password123@",
		});

		expect(response.status).toBe(201);
		userId = response.body.data.id;
	});

	it("should fail when logging in with incorrect credentials", async () => {
		const response = await request(app).post("/login").send({
			email: testEmail,
			password: "WrongPassword123@",
		});

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
		);

		expect(response.status).toBe(error.statusCode);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
	});

	it("should fail when logging in without an email", async () => {
		const response = await request(app).post("/login").send({
			password: "Password123@",
		});

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
		);

		expect(response.status).toBe(error.statusCode);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
	});

	it("should fail when logging in with an invalid email format", async () => {
		const response = await request(app).post("/login").send({
			email: "invalidemail",
			password: "Password123@",
		});

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
		);

		expect(response.status).toBe(error.statusCode);
		expect(response.body.status).toBe("error");
		expect(response.body.message).toBe(error.message);
	});

	it("should log in successfully and set the token in the cookie", async () => {
		const response = await request(app).post("/login").send({
			email: testEmail,
			password: "Password123@",
		});

		expect(response.status).toBe(201);
		expect(response.body.status).toBe("success");
		expect(response.body.data.token).toBeDefined();
		token = response.body.data.token;
		expect(response.headers["set-cookie"]).toBeDefined();
		expect(response.headers["set-cookie"][0]).toContain("token=");
	});

	it("should verify the cookie settings", async () => {
		const response = await request(app).post("/login").send({
			email: testEmail,
			password: "Password123@",
		});

		const cookie = response.headers["set-cookie"][0];
		expect(cookie).toContain("token=");
		expect(cookie).toContain("HttpOnly");
		expect(cookie).toContain("Secure");
		expect(cookie).toContain("SameSite=Strict");
		expect(cookie).toContain("Max-Age=3600");
	});

	it("should return status 201 on successful login", async () => {
		const response = await request(app).post("/login").send({
			email: testEmail,
			password: "Password123@",
		});

		expect(response.status).toBe(201);
	});

	afterAll(async () => {
		// Delete the test user after running the tests
		const response = await request(app)
			.delete("/users")
			.set("Authorization", `Bearer ${token}`);
		expect(response.status).toBe(200);

		// Close the database connection
		await pool.end();
	});
});
