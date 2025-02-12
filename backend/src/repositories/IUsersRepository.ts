import { User } from "../entities/User";

export interface IUsersRepository {
	// Methos to find a user by id
	findById(id: string): Promise<User>;

	// Method to find a user by email
	findByEmail(email: string): Promise<User>;

	// Method to save a new user
	save(user: User): Promise<void>;

	// Method to update a user
	update(user: User): Promise<void>;
}
