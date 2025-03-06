// Fields required to update a goal
export interface IUpdateGoalRequestDTO {
	id: string;
	user_id: string;
	title?: string;
	description?: string;
}

// Fields returned in the response after updating a user
export interface IUpdateGoalResponseDTO {
	id: string;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
}
