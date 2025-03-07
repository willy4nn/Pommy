import { UpdateGoalController } from "../UpdateGoalController";
import { UpdateGoalUseCase } from "../UpdateGoalUseCase";
import { IUpdateGoalResponseDTO } from "../UpdateGoalDTO";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../../helpers/ApiResponse";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { v4 as uuidv4 } from "uuid";

jest.mock("../UpdateGoalUseCase");

describe("UpdateGoalController", () => {
	let updateGoalUseCase: jest.Mocked<UpdateGoalUseCase>;
	let updateGoalController: UpdateGoalController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let nextFunction: jest.Mock;

	beforeEach(() => {
		updateGoalUseCase = new UpdateGoalUseCase(
			null!
		) as jest.Mocked<UpdateGoalUseCase>;
		updateGoalController = new UpdateGoalController(updateGoalUseCase);

		nextFunction = jest.fn();
		mockRequest = {
			user: { userId: uuidv4() },
			body: {
				id: uuidv4(),
				title: "Updated Goal",
				description: "Updated description",
			},
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn().mockReturnThis(),
		};
	});

	it("should update a goal and return the updated data", async () => {
		const updatedGoalDTO: IUpdateGoalResponseDTO = {
			id: mockRequest.body.id,
			title: mockRequest.body.title,
			description: mockRequest.body.description,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		updateGoalUseCase.execute.mockResolvedValue(updatedGoalDTO);

		await updateGoalController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		expect(mockResponse.status).toHaveBeenCalledWith(200);
		expect(mockResponse.json).toHaveBeenCalledWith(
			ApiResponse.success(updatedGoalDTO, "Goal updated successfully")
		);
	});

	it("should call next with error when update fails", async () => {
		const error = new CustomError(
			ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_UPDATE_FAILED
		);
		updateGoalUseCase.execute.mockRejectedValue(error);

		await updateGoalController.handle(
			mockRequest as Request,
			mockResponse as Response,
			nextFunction
		);

		expect(nextFunction).toHaveBeenCalledWith(error);
	});
});
