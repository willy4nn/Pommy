import { User } from "../entities/User";

export interface IUsersRepository {
	findByEmail(email: string): Promise<User>;
	findById(email: string): Promise<User>;
	save(user: User): Promise<void>;
	update(user: User): Promise<User>;
	delete(id: string): Promise<void>;
}
