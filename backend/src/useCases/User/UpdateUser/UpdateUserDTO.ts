// Fields allowed to update a user
export interface IUpdateUserRequestDTO {
	id: string;
	name?: string;
	email?: string;
	password?: string;
}

// Fields returned in the response after updating a user
export interface IUpdateUserResponseDTO {
	id: string;
	name: string;
	email: string;
	created_at: string;
	updated_at: string;
}
