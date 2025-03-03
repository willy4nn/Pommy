import { v4 as uuidv4 } from "uuid";

export class User {
	public readonly id: string;
	public readonly createdAt: Date;

	public name: string;
	public email: string;
	public password: string;
	public updatedAt: Date;

	constructor(
		props: Omit<User, "id" | "createdAt" | "updatedAt">,
		id?: string,
		createdAt?: Date,
		updatedAt?: Date
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

		// Set updatedAt to the provided value or default to createdAt
		if (!updatedAt) {
			this.updatedAt = this.createdAt;
		} else {
			this.updatedAt = updatedAt;
		}
	}
}
