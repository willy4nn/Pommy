import { CustomError, ErrorCatalog } from "../errors/CustomError";
// Function to validate the user's ID
function validateId(id: string): void {
	// Check if the ID is provided
	if (!id) {
		throw new CustomError(ErrorCatalog.ERROR.USER.VALIDATION.ID_REQUIRED);
	}
	// Check if the ID is a valid string
	if (typeof id !== "string" || id.trim() === "") {
		throw new CustomError(ErrorCatalog.ERROR.USER.VALIDATION.ID_INVALID);
	}
	// Check if the ID matches the general UUID format
	const uuidRegex =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
	if (!uuidRegex.test(id)) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.ID_INVALID_FORMAT
		);
	}
}

// Function to validate the user's name
function validateName(name: string): void {
	// Check if the name is provided
	if (!name) {
		throw new CustomError(ErrorCatalog.ERROR.USER.VALIDATION.NAME_REQUIRED);
	}
	// Check if the name length is between 3 and 50 characters
	if (name.length < 3 || name.length > 50) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.INVALID_NAME_LENGTH
		);
	}
	// Check if the name contains only valid characters (letters and spaces)
	if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.INVALID_NAME_FORMAT
		);
	}
}
// Function to validate the user's email address
function validateEmail(email: string): void {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	// Check if the email is provided
	if (!email) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.EMAIL_REQUIRED
		);
	}
	// Check if the email exceeds 254 characters
	if (email.length > 254) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.EMAIL_TOO_LONG
		);
	}
	// Validate the basic email format
	if (!emailRegex.test(email)) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.INVALID_EMAIL_FORMAT
		);
	}
	const [localPart, domain] = email.split("@");
	// Check if the domain part of the email is missing
	if (!domain) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.EMAIL_DOMAIN_MISSING
		);
	}
	// Validate the domain length and presence of a dot
	if (domain.length < 3 || !domain.includes(".")) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.EMAIL_DOMAIN_INVALID
		);
	}
	// Ensure the domain doesn't start or end with a dot
	if (domain.startsWith(".") || domain.endsWith(".")) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.EMAIL_DOMAIN_INVALID_FORMAT
		);
	}
	// Check if the local part contains invalid characters
	if (/[^a-zA-Z0-9._%+-]/.test(localPart)) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.LOCAL_PART_INVALID
		);
	}
}
// Function to validate the user's password
function validatePassword(password: string): void {
	// Check if the password is provided
	if (!password) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.PASSWORD_REQUIRED
		);
	}
	// Check if the password has a minimum length of 8 characters
	if (password.length < 8) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.PASSWORD_TOO_SHORT
		);
	}
	// Check if the password contains at least one uppercase letter
	if (!/[A-Z]/.test(password)) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.PASSWORD_NO_UPPERCASE
		);
	}
	// Check if the password contains at least one lowercase letter
	if (!/[a-z]/.test(password)) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.PASSWORD_NO_LOWERCASE
		);
	}
	// Check if the password contains at least one number
	if (!/[0-9]/.test(password)) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.PASSWORD_NO_NUMBER
		);
	}
	// Check if the password contains at least one special character
	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		throw new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.PASSWORD_NO_SPECIAL_CHAR
		);
	}
}
export { validateName, validateEmail, validatePassword, validateId };
