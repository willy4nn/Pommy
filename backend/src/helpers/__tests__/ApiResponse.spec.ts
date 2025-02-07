import { ApiResponse } from "../ApiResponse"; // ajuste o caminho conforme necessário

describe("ApiResponse", () => {
	it("should create a successful response", () => {
		const data = { id: 1, name: "Test" };
		const message = "Request completed successfully";

		const response = ApiResponse.success(data, message);

		expect(response.status).toBe("success");
		expect(response.message).toBe(message);
		expect(response.data).toBe(data);
		expect(response.statusCode).toBeUndefined();
		expect(response.errorName).toBeUndefined();
	});

	it("should create an error response", () => {
		const statusCode = 400;
		const message = "An error occurred during the request";
		const errorName = "BadRequest";

		const response = ApiResponse.error(statusCode, message, errorName);

		expect(response.status).toBe("error");
		expect(response.message).toBe(message);
		expect(response.data).toBeUndefined();
		expect(response.statusCode).toBe(statusCode);
		expect(response.errorName).toBe(errorName);
	});
});
