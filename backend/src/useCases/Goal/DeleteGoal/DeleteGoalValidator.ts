import { IDeleteGoalRequestDTO } from "./DeleteGoalDTO";
import { validateGoalId } from "../../../validators/goalValidators";
// Validator function to validate goal deletion data
export function deleteGoalValidator(data: IDeleteGoalRequestDTO): void {
	validateGoalId(data.id);
}
