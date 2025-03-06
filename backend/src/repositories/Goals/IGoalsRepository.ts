import { Goal } from "../../entities/Goal/Goal";

export interface IGoalsRepository {
	// Method to save a goal
	save(goal: Goal): Promise<void>;

	// Method to count the number of goals for a specific user
	countByUserId(userId: string): Promise<number>;
}
