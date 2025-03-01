import { UpdateUserController } from "../UpdateUserController";
import { UpdateUserUseCase } from "../UpdateUserUseCase";
import { IUpdateUserResponseDTO } from "../UpdateUserDTO";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../../helpers/ApiResponse";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

// Mocking the use case
jest.mock("../UpdateUserUseCase");

describe("UpdateUserController", () => {
	let updateUserUseCase: jest.Mocked<UpdateUserUseCase>;
	let updateUserController: UpdateUserController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: jest.Mock;

	beforeEach(() => {
		// Creating a mocked instance of the use case
		updateUserUseCase = new UpdateUserUseCase(
			null!
		) as jest.Mocked<UpdateUserUseCase>;

		// Instantiating the controller
		updateUserController = new UpdateUserController(updateUserUseCase);

		// Mocking the request, response, and next function
		nextFunction = jest.fn();
		mockRequest = {
			user: {
				// Mock user ID that will be used to update the user
				userId: "1",
			},
			body: {
				name: "updated user",
				email: "updateduser@user.com",
				password: "UpdatedPassword123@",
			},
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
	});

	it("should update the user and return the updated user data", async () => {
		const updatedUserDTO: IUpdateUserResponseDTO = {
			id: "1",
			name: "updated user",
			email: "updateduser@user.com",
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		// Mocking the use case to resolve with the updated user data
		updateUserUseCase.execute.mockResolvedValue(updatedUserDTO);

		// Calling the controller's handle method
		await updateUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		// Verifying that the status and response json methods were called correctly
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.success(updatedUserDTO, "User updated successfully")
		);
	});

	it("should return an error message if something goes wrong", async () => {
		// Simulating an error in the use case execution
		updateUserUseCase.execute.mockRejectedValue(
			new CustomError(ErrorCatalog.ERROR.USER.REPOSITORY.USER_UPDATE_FAILED)
		);

		// Calling the controller's handle method and passing the next function
		await updateUserController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		// Expecting the next function to be called with the error
		expect(nextFunction).toHaveBeenCalledWith(
			new CustomError(ErrorCatalog.ERROR.USER.REPOSITORY.USER_UPDATE_FAILED)
		);
	});
});
