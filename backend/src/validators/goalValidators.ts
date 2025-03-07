import { CustomError, ErrorCatalog } from "../errors/CustomError";

// Validates the goal ID
function validateGoalId(goalId: string): void {
	if (!goalId) {
		throw new CustomError(
			ErrorCatalog.ERROR.GOAL.VALIDATION.GOAL_ID_REQUIRED
		);
	}
	const uuidRegex =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
	if (!uuidRegex.test(goalId)) {
		throw new CustomError(
			ErrorCatalog.ERROR.GOAL.VALIDATION.GOAL_ID_INVALID_FORMAT
		);
	}
}

// Validates the user ID associated with the goal
function validateUserId(userId: string): void {
	if (!userId) {
		throw new CustomError(
			ErrorCatalog.ERROR.GOAL.VALIDATION.USER_ID_REQUIRED
		);
	}
	const uuidRegex =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
	if (!uuidRegex.test(userId)) {
		throw new CustomError(
			ErrorCatalog.ERROR.GOAL.VALIDATION.USER_ID_INVALID_FORMAT
		);
	}
}

// Validates the goal title
function validateTitle(title: string): void {
	if (!title) {
		throw new CustomError(
			ErrorCatalog.ERROR.GOAL.VALIDATION.TITLE_REQUIRED
		);
	}
	if (title.length < 3 || title.length > 100) {
		throw new CustomError(
			ErrorCatalog.ERROR.GOAL.VALIDATION.INVALID_TITLE_LENGTH
		);
	}
}

// Validates the goal description
function validateDescription(description: string): void {
	if (!description) {
		throw new CustomError(
			ErrorCatalog.ERROR.GOAL.VALIDATION.DESCRIPTION_REQUIRED
		);
	}
	if (description.length < 10 || description.length > 500) {
		throw new CustomError(
			ErrorCatalog.ERROR.GOAL.VALIDATION.INVALID_DESCRIPTION_LENGTH
		);
	}
}

export { validateGoalId, validateUserId, validateTitle, validateDescription };
