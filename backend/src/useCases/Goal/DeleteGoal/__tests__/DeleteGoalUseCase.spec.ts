import { DeleteGoalUseCase } from "../DeleteGoalUseCase";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { IGoalsRepository } from "../../../../repositories/Goals/IGoalsRepository";
import { v4 as uuidv4 } from "uuid";

describe("DeleteGoalUseCase", () => {
	let deleteGoalUseCase: DeleteGoalUseCase;
	let mockGoalsRepository: IGoalsRepository;

	beforeEach(() => {
		mockGoalsRepository = {
			findById: jest.fn().mockResolvedValue({
				id: uuidv4(),
				title: "Test Goal",
				description: "Description",
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
			delete: jest.fn().mockResolvedValue(undefined),
			save: jest.fn(),
			countByUserId: jest.fn(),
			update: jest.fn(),
		};

		deleteGoalUseCase = new DeleteGoalUseCase(mockGoalsRepository);
	});

	it("should delete the goal successfully", async () => {
		const goalId = uuidv4();
		await deleteGoalUseCase.execute({ id: goalId });

		expect(mockGoalsRepository.findById).toHaveBeenCalledWith(goalId);
		expect(mockGoalsRepository.delete).toHaveBeenCalledWith(goalId);
	});

	it("should throw an error if the goal does not exist", async () => {
		mockGoalsRepository.findById = jest.fn().mockResolvedValue(null);
		const goalId = uuidv4();

		await expect(deleteGoalUseCase.execute({ id: goalId })).rejects.toThrow(
			new CustomError(ErrorCatalog.ERROR.GOAL.SERVICE.GOAL_NOT_FOUND)
		);

		expect(mockGoalsRepository.findById).toHaveBeenCalledWith(goalId);
		expect(mockGoalsRepository.delete).not.toHaveBeenCalled();
	});

	it("should throw an error if deletion fails", async () => {
		const error = new CustomError(
			ErrorCatalog.ERROR.GOAL.REPOSITORY.GOAL_DELETE_FAILED
		);
		mockGoalsRepository.delete = jest.fn().mockRejectedValue(error);
		const goalId = uuidv4();

		await expect(deleteGoalUseCase.execute({ id: goalId })).rejects.toThrow(
			error
		);
		expect(mockGoalsRepository.delete).toHaveBeenCalledWith(goalId);
	});
});
