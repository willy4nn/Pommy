import { User } from "../entities/User";

export interface IUsersRepository {
	// Method to find a user by email
	findByEmail(email: string): Promise<User>;

	// Method to save a new user
	save(user: User): Promise<void>;
}
