import { DeleteGoalController } from "../DeleteGoalController";
import { DeleteGoalUseCase } from "../DeleteGoalUseCase";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../../helpers/ApiResponse";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

jest.mock("../DeleteGoalUseCase");

describe("DeleteGoalController", () => {
	let deleteGoalUseCase: jest.Mocked<DeleteGoalUseCase>;
	let deleteGoalController: DeleteGoalController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: jest.Mock;

	beforeEach(() => {
		deleteGoalUseCase = new DeleteGoalUseCase(
			null!
		) as jest.Mocked<DeleteGoalUseCase>;
		deleteGoalController = new DeleteGoalController(deleteGoalUseCase);
		nextFunction = jest.fn();
		mockRequest = { body: { id: "test-id" } };
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
	});

	it("should delete the goal and return a success response", async () => {
		deleteGoalUseCase.execute.mockResolvedValue();

		await deleteGoalController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		expect(deleteGoalUseCase.execute).toHaveBeenCalledWith({
			id: "test-id",
		});
		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.success({}, "Goal deleted successfully")
		);
	});

	it("should call next with error when deletion fails", async () => {
		const error = new CustomError(
			ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_DELETE_FAILED
		);
		deleteGoalUseCase.execute.mockRejectedValue(error);

		await deleteGoalController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		expect(nextFunction).toHaveBeenCalledWith(error);
	});
});
