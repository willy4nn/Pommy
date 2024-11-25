import { v4 as uuidv4 } from "uuid";

export class User {
	public readonly id: string;
	public readonly createdAt: Date;

	public name: string;
	public email: string;
	public password: string;

	constructor(
		props: Omit<User, "id" | "createdAt">,
		id?: string,
		createdAt?: Date
	) {
		// Assign provided properties to the user instance
		Object.assign(this, props);

		// Generate a new ID if no ID is provided
		if (!id) {
			this.id = uuidv4();
		} else {
			this.id = id;
		}

		// Set createdAt to the current date if not provided
		if (!createdAt) {
			this.createdAt = new Date();
		} else {
			this.createdAt = createdAt;
		}
	}
}
