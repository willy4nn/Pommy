import {
	validateEmail,
	validatePassword,
} from "../../../validators/userValidators";
import { ILoginUserRequestDTO } from "./LoginUserDTO";

// Validator function to validate user login
export function loginUserValidator(data: ILoginUserRequestDTO): void {
	validateEmail(data.email);
	validatePassword(data.password);
}
