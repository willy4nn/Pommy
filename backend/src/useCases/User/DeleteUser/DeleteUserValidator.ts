import { IDeleteUserRequestDTO } from "./DeleteUserDTO";
import { validateId } from "../../../validators/userValidators";
// Validator function to validate user deletion data
export function deleteUserValidator(data: IDeleteUserRequestDTO): void {
	validateId(data.id);
}
