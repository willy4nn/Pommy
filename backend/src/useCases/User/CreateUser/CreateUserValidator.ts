import { ICreateUserRequestDTO } from "./CreateUserDTO";
import {
	validateName,
	validateEmail,
	validatePassword,
} from "../../../validators/userValidators";
// Validator function to validate user creation data
export function createUserValidator(data: ICreateUserRequestDTO): void {
	validateName(data.name);
	validateEmail(data.email);
	validatePassword(data.password);
}
