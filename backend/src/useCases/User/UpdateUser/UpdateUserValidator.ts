import {
	validateEmail,
	validateId,
	validateName,
	validatePassword,
} from "../../../validators/userValidators";
import { IUpdateUserRequestDTO } from "./UpdateUserDTO";

// Validator function to validate user update data
export function updateUserValidator(data: IUpdateUserRequestDTO): void {
	const { id, name, email, password } = data;

	// Validate user ID if provided
	if (id) {
		validateId(id);
	}

	// Validate name if provided
	if (name) {
		validateName(name);
	}

	// Validate email if provided
	if (email) {
		validateEmail(email);
	}

	// Validate password if provided
	if (password) {
		validatePassword(password);
	}
}
