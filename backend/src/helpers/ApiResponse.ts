export class ApiResponse<T> {
	status: string;
	message: string;
	data?: T;
	statusCode?: number;
	errorName?: string;
	details?: string;

	private constructor(
		status: string,
		message: string,
		data?: T,
		statusCode?: number,
		errorName?: string,
		details?: string
	) {
		this.status = status;
		this.message = message;
		this.data = data;
		this.statusCode = statusCode;
		this.errorName = errorName;
		this.details = details;
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
		message: string,
		errorName: string,
		details: string
	): ApiResponse<null> {
		return new ApiResponse(
			"error",
			message,
			undefined,
			statusCode,
			errorName,
			details
		);
	}
}
