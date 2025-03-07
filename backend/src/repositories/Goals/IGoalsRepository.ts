import { Goal } from "../../entities/Goal/Goal";

export interface IGoalsRepository {
	// Method to save a goal
	save(goal: Goal): Promise<void>;

	// Method to find a goal by id
	findById(id: string): Promise<Goal>;

	// Method to find all goals for a specific user
	findAllByUserId(userId: string): Promise<Goal[]>;

	// Method to count the number of goals for a specific user
	countByUserId(userId: string): Promise<number>;

	// Method to update a goal
	update(goal: Goal): Promise<void>;

	// Method to delete a goal
	delete(id: string): Promise<void>;
}
