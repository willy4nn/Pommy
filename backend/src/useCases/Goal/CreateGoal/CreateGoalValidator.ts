import { ICreateGoalRequestDTO } from "./CreateGoalDTO";
import {
	validateUserId,
	validateTitle,
	validateDescription,
} from "../../../validators/goalValidators";
// Validator function to validate goal creation data
export function createGoalValidator(data: ICreateGoalRequestDTO): void {
	validateUserId(data.user_id);
	validateTitle(data.title);
	validateDescription(data.description);
}
