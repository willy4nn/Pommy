import { PostgresUsersRepository } from "./PostgresUsersRepository";
import { User } from "../../entities/User";
import { CustomError, ErrorCatalog } from "../../errors/CustomError";

// Mock for the database connection and release methods
const mockQuery = jest.fn();
const mockRelease = jest.fn();

jest.mock("../../config/db", () => ({
	pool: {
		connect: jest.fn(() => ({
			query: mockQuery,
			release: mockRelease,
		})),
	},
}));

describe("PostgresUsersRepository (Unit Test)", () => {
	const repository = new PostgresUsersRepository();

	afterEach(() => {
		// Clear mock calls to ensure tests don't interfere with each other
		mockQuery.mockClear();
		mockRelease.mockClear();
	});

	it("should find a user by email", async () => {
		const userProps = {
			name: "Alice",
			email: "alice@example.com",
			password: "123456",
		};
		const createdAt = new Date();
		const updatedAt = new Date();
		const user = new User(userProps, undefined, createdAt, updatedAt);

		// Mock database response
		mockQuery.mockResolvedValueOnce({
			rows: [
				{
					id: user.id,
					name: user.name,
					email: user.email,
					password: user.password,
					created_at: createdAt,
					updated_at: updatedAt,
				},
			],
		});

		const foundUser = await repository.findByEmail("alice@example.com");

		// Check that the returned user matches expected values
		expect(foundUser).toBeDefined();
		expect(foundUser.name).toBe(user.name);
		expect(foundUser.email).toBe(user.email);
		expect(foundUser.createdAt).toEqual(createdAt);
		expect(foundUser.updatedAt).toEqual(updatedAt);

		// Verify that the correct query was executed
		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT * FROM users WHERE email = $1",
			["alice@example.com"]
		);
	});

	it("should return null if no user is found by email", async () => {
		// Mock a case where no user is found
		mockQuery.mockResolvedValueOnce({
			rows: [],
		});

		const foundUser = await repository.findByEmail(
			"nonexistent@example.com"
		);

		// Ensure null is returned when no user is found
		expect(foundUser).toBeNull();
		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT * FROM users WHERE email = $1",
			["nonexistent@example.com"]
		);
	});

	it("should save a user", async () => {
		const userProps = {
			name: "Bob",
			email: "bob@example.com",
			password: "654321",
		};
		const createdAt = new Date();
		const updatedAt = new Date();
		const user = new User(userProps, undefined, createdAt, updatedAt);

		// Mock successful insert operation
		mockQuery.mockResolvedValueOnce({ rows: [] });

		await repository.save(user);

		// Check that the insert query was executed with correct parameters
		expect(mockQuery).toHaveBeenCalledWith(
			"INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
			[
				user.id,
				user.name,
				user.email,
				user.password,
				user.createdAt,
				user.updatedAt,
			]
		);
	});

	it("should throw an error if query fails in save", async () => {
		const userProps = {
			name: "Charlie",
			email: "charlie@example.com",
			password: "789012",
		};
		const createdAt = new Date();
		const updatedAt = new Date();
		const user = new User(userProps, undefined, createdAt, updatedAt);

		// Mock query failure scenario
		const dbError = new Error("Database error");
		mockQuery.mockRejectedValueOnce(dbError);

		try {
			await repository.save(user);
		} catch (error) {
			// Check that the error is an instance of CustomError
			expect(error).toBeInstanceOf(CustomError);

			// Check the structure of the CustomError
			expect(error.message).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_SAVE_FAILED.message
			);
			expect(error.statusCode).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_SAVE_FAILED.statusCode
			);
			expect(error.errorName).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_SAVE_FAILED.errorName
			);

			// Check if the original error message was appended to details
			expect(error.details).toBe(dbError.message);
		}
	});

	it("should release client after executing query", async () => {
		const userProps = {
			name: "Dave",
			email: "dave@example.com",
			password: "321654",
		};
		const createdAt = new Date();
		const updatedAt = new Date();
		const user = new User(userProps, undefined, createdAt, updatedAt);

		// Simulate successful insertion
		mockQuery.mockResolvedValueOnce({ rows: [] });

		// Test save method to ensure client is released
		await repository.save(user);

		// Ensure that the database client is released after query execution
		expect(mockRelease).toHaveBeenCalled();
	});

	it("should release client after findByEmail query", async () => {
		const userProps = {
			name: "Eve",
			email: "eve@example.com",
			password: "112233",
		};
		const createdAt = new Date();
		const updatedAt = new Date();
		const user = new User(userProps, undefined, createdAt, updatedAt);

		// Simulate database response for findByEmail
		mockQuery.mockResolvedValueOnce({
			rows: [
				{
					id: user.id,
					name: user.name,
					email: user.email,
					password: user.password,
					created_at: createdAt,
					updated_at: updatedAt,
				},
			],
		});

		// Test the findByEmail method
		await repository.findByEmail("eve@example.com");

		// Ensure the client is released after query execution
		expect(mockRelease).toHaveBeenCalled();
	});

	it("should find a user by id", async () => {
		const userProps = {
			name: "Alice",
			email: "alice@example.com",
			password: "123456",
		};
		const createdAt = new Date();
		const updatedAt = new Date();
		const user = new User(userProps, undefined, createdAt, updatedAt);

		// Mock database response
		mockQuery.mockResolvedValueOnce({
			rows: [
				{
					id: user.id,
					name: user.name,
					email: user.email,
					password: user.password,
					created_at: createdAt,
					updated_at: updatedAt,
				},
			],
		});

		const foundUser = await repository.findById(user.id);

		// Check that the returned user matches expected values
		expect(foundUser).toBeDefined();
		expect(foundUser.name).toBe(user.name);
		expect(foundUser.email).toBe(user.email);
		expect(foundUser.createdAt).toEqual(createdAt);
		expect(foundUser.updatedAt).toEqual(updatedAt);

		// Verify that the correct query was executed
		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT * FROM users WHERE id = $1",
			[user.id]
		);
	});

	it("should return null if no user is found by id", async () => {
		// Mock a case where no user is found
		mockQuery.mockResolvedValueOnce({
			rows: [],
		});

		const foundUser = await repository.findById("nonexistent-id");

		// Ensure null is returned when no user is found
		expect(foundUser).toBeNull();
		expect(mockQuery).toHaveBeenCalledWith(
			"SELECT * FROM users WHERE id = $1",
			["nonexistent-id"]
		);
	});

	it("should throw an error if query fails in findById", async () => {
		const dbError = new Error("Database error");
		mockQuery.mockRejectedValueOnce(dbError);

		try {
			await repository.findById("some-id");
		} catch (error) {
			// Check that the error is an instance of CustomError
			expect(error).toBeInstanceOf(CustomError);

			// Check the structure of the CustomError
			expect(error.message).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_NOT_FOUND.message
			);
			expect(error.statusCode).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_NOT_FOUND.statusCode
			);
			expect(error.errorName).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_NOT_FOUND.errorName
			);

			// Check if the original error message was appended to details
			expect(error.details).toBe(dbError.message);
		}
	});

	it("should update a user", async () => {
		const userProps = {
			name: "Bob",
			email: "bob@example.com",
			password: "654321",
		};
		const createdAt = new Date();
		const updatedAt = new Date();
		const user = new User(userProps, undefined, createdAt, updatedAt);

		// Mock successful update operation
		mockQuery.mockResolvedValueOnce({ rows: [] });

		await repository.update(user);

		// Check that the update query was executed with correct parameters
		expect(mockQuery).toHaveBeenCalledWith(
			"UPDATE users SET name = $1, email = $2, password = $3, updated_at = $4 WHERE id = $5",
			[user.name, user.email, user.password, user.updatedAt, user.id]
		);
	});

	it("should throw an error if query fails in update", async () => {
		const userProps = {
			name: "Charlie",
			email: "charlie@example.com",
			password: "789012",
		};
		const createdAt = new Date();
		const updatedAt = new Date();
		const user = new User(userProps, undefined, createdAt, updatedAt);

		// Mock query failure scenario
		const dbError = new Error("Database error");
		mockQuery.mockRejectedValueOnce(dbError);

		try {
			await repository.update(user);
		} catch (error) {
			// Check that the error is an instance of CustomError
			expect(error).toBeInstanceOf(CustomError);

			// Check the structure of the CustomError
			expect(error.message).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_UPDATE_FAILED.message
			);
			expect(error.statusCode).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_UPDATE_FAILED.statusCode
			);
			expect(error.errorName).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_UPDATE_FAILED.errorName
			);

			// Check if the original error message was appended to details
			expect(error.details).toBe(dbError.message);
		}
	});

	it("should delete a user", async () => {
		// Simulates successful deletion
		mockQuery.mockResolvedValueOnce({ rowCount: 1 });

		await repository.delete("user-id");

		expect(mockQuery).toHaveBeenCalledWith(
			"DELETE FROM users WHERE id = $1",
			["user-id"]
		);
		expect(mockRelease).toHaveBeenCalled();
	});

	it("should not throw an error if no user is found during delete", async () => {
		// Simulates scenario where no user is found (rowCount = 0), but without throwing an error
		mockQuery.mockResolvedValueOnce({ rowCount: 0 });

		await repository.delete("nonexistent-id");

		expect(mockQuery).toHaveBeenCalledWith(
			"DELETE FROM users WHERE id = $1",
			["nonexistent-id"]
		);
		expect(mockRelease).toHaveBeenCalled();
	});

	it("should throw CustomError USER_DELETE_FAILED if query fails during delete", async () => {
		// Simulates an unexpected query failure
		const dbError = new Error("Database error");
		mockQuery.mockRejectedValueOnce(dbError);

		try {
			await repository.delete("some-id");
			fail("Expected error was not thrown");
		} catch (error) {
			expect(error).toBeInstanceOf(CustomError);
			expect(error.message).toBe("Failed to delete user");
			expect(error.statusCode).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_DELETE_FAILED.statusCode
			);
			expect(error.errorName).toBe(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_DELETE_FAILED.errorName
			);
			expect(error.details).toBe("Database error");
			expect(mockRelease).toHaveBeenCalled();
		}
	});
});
