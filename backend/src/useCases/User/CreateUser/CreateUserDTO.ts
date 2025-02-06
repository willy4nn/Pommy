// Fields required to create a user
export interface ICreateUserRequestDTO {
	name: string;
	email: string;
	password: string;
}

// Fields returned in the response after creating a user
export interface ICreateUserResponseDTO {
	id: string;
	name: string;
	email: string;
	created_at: string;
	updated_at: string;
}
