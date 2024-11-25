export class ApiResponse<T> {
	status: string;
	message: string;
	data?: T;
	statusCode?: number;
	errorName?: string;

	private constructor(
		status: string,
		message: string,
		data?: T,
		statusCode?: number,
		errorName?: string
	) {
		this.status = status;
		this.message = message;
		this.data = data;
		this.statusCode = statusCode;
		this.errorName = errorName;
	}

	// Method for success responses
	static success<T>(
		data: T,
		message: string = "Request completed successfully"
	): ApiResponse<T> {
		return new ApiResponse("success", message, data);
	}

	// Method for error responses
	static error(
		statusCode: number,
		message: string = "An error occurred during the request",
		errorName: string = "Error"
	): ApiResponse<null> {
		return new ApiResponse(
			"error",
			message,
			undefined,
			statusCode,
			errorName
		);
	}
}
