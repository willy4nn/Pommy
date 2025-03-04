import { Goal } from "../../entities/Goal/Goal";

export interface IGoalsRepository {
	// Method to save a goal
	save(goal: Goal): Promise<void>;
}
