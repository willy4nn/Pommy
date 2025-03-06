// Fields required to create a goal
export interface ICreateGoalRequestDTO {
	user_id: string;
	title: string;
	description: string;
}

// Fields returned in the response after creating a user
export interface ICreateGoalResponseDTO {
	id: string;
	title: string;
	description: string;
	created_at: string;
	updated_at: string;
}
