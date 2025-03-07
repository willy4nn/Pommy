import { IUpdateGoalRequestDTO } from "./UpdateGoalDTO";
import {
	validateGoalId,
	validateUserId,
	validateTitle,
	validateDescription,
} from "../../../validators/goalValidators";
export function updateGoalValidator(data: IUpdateGoalRequestDTO): void {
	const { id, user_id, title, description } = data;
	validateGoalId(id);
	validateUserId(user_id);
	if (title) {
		validateTitle(title);
	}
	if (description) {
		validateDescription(description);
	}
}
