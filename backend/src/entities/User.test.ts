import { User } from "./User";

describe("User Entity", () => {
	it("Should create a user with default values", () => {
		// Scenario: Creating a user without providing id, createdAt, or updatedAt.

		const props = {
			name: "Alice",
			email: "alice@example.com",
			password: "123456",
		};

		// Create a user instance
		const user = new User(props);

		// Check if the name is assigned correctly
		expect(user.name).toBe("Alice");

		// Check if the email is assigned correctly
		expect(user.email).toBe("alice@example.com");

		// Verify createdAt is a valid Date instance
		expect(user.createdAt).toBeInstanceOf(Date);

		// Verify updatedAt defaults to createdAt
		expect(user.updatedAt).toBe(user.createdAt);
	});

	it("Should create a user with existing values", () => {
		// Scenario: Creating a user by providing id, createdAt, and updatedAt.

		const createdAt = new Date("2023-01-01");
		const updatedAt = new Date("2023-01-02");

		const props = {
			name: "Bob",
			email: "bob@example.com",
			password: "654321",
		};

		// Create a user instance with specific values
		const user = new User(props, "123", createdAt, updatedAt);

		// Verify the id is assigned correctly
		expect(user.id).toBe("123");

		// Verify createdAt matches the provided value
		expect(user.createdAt).toBe(createdAt);

		// Verify updatedAt matches the provided value
		expect(user.updatedAt).toBe(updatedAt);

		// Check if the name is assigned correctly
		expect(user.name).toBe("Bob");
	});
});
