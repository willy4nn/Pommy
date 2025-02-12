import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import { LogoutUserController } from "../LogoutUserController"; // Correct path for your controller

describe("Integration: LogoutUserController", () => {
	let app: express.Express;
	let controller: LogoutUserController;

	beforeEach(() => {
		controller = new LogoutUserController();

		// Setup express app
		app = express();
		app.use(express.json());
		app.post("/logout", (req: Request, res: Response, next: NextFunction) =>
			controller.handle(req, res, next)
		);

		// Middleware to handle errors
		app.use((err: any, req: Request, res: Response, next: NextFunction) => {
			res.status(err.statusCode || 500).json({
				status: "error",
				message: err.message,
				errorName: err.errorName || "",
				details: err.details || "",
			});
		});
	});

	it("should logout the user and clear the token cookie", async () => {
		const response = await request(app)
			.post("/logout")
			.set("Cookie", "token=testtoken") // Simulating an existing token in the cookie
			.send(); // Send the request to logout

		// Check if the cookie 'token' was cleared, allowing for additional attributes
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

		// Verify the status is 200
		expect(response.status).toBe(200);

		// Verify the response body content
		expect(response.body).toEqual(
			expect.objectContaining({
				status: "success",
				message: "User logged out successfully!",
			})
		);
	});

	it("should return an error if there is an issue clearing the cookie", async () => {
		// Simulate a scenario where clearing the cookie fails
		const mockClearCookie = jest.fn().mockImplementationOnce(() => {
			throw new Error("Cookie clearing error");
		});
		controller = new LogoutUserController();
		controller.handle = mockClearCookie;

		const response = await request(app)
			.post("/logout")
			.set("Cookie", "token=testtoken")
			.send();

		// Check if next was called with an error
		expect(mockClearCookie).toHaveBeenCalled();
		expect(response.status).toBe(500);
		expect(response.body.message).toBe("Cookie clearing error");
	});
});
