import { IUpdateGoalRequestDTO } from "./UpdateGoalDTO";
import {
	validateUserId,
	validateTitle,
	validateDescription,
} from "../../../validators/goalValidators";
export function updateGoalValidator(data: IUpdateGoalRequestDTO): void {
	const { id, user_id, title, description } = data;
	validateUserId(id);
	validateUserId(user_id);
	if (title) {
		validateTitle(title);
	}
	if (description) {
		validateDescription(description);
	}
}
