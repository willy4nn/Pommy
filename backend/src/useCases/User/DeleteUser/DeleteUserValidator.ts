import { validateId } from "../../../validators/userValidators";
import { IDeleteUserRequestDTO } from "./DeleteUserDTO";

// Validator function to validate user delete data
export function deleteUserValidator(data: IDeleteUserRequestDTO): void {
	// Validate user ID
	validateId(data.id);
}
