import { UpdateUserUseCase } from "../UpdateUserUseCase";
import { PostgresUsersRepository } from "../../../../repositories/implementations/PostgresUsersRepository";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// Mocking the repository
jest.mock(
	"../../../../repositories/implementations/PostgresUsersRepository.ts"
);

// Mock bcrypt.hash explicitly with a return value
jest.mock("bcrypt", () => ({
	...jest.requireActual("bcrypt"),
	hash: jest.fn().mockResolvedValue("HashedPassword123@"), // Set the return value for hash
}));

describe("UpdateUserUseCase (Unit Tests)", () => {
	let updateUserUseCase: UpdateUserUseCase;
	let mockPostgresUsersRepository: jest.Mocked<PostgresUsersRepository>;

	beforeEach(() => {
		mockPostgresUsersRepository =
			new PostgresUsersRepository() as jest.Mocked<PostgresUsersRepository>;

		// Mocking the 'update' function of the repository
		mockPostgresUsersRepository.update = jest.fn().mockResolvedValue({
			id: uuidv4(), // Generate a valid UUID
			name: "updated user",
			email: "updateduser@user.com",
			password: "HashedPassword123@",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		// Mocking the 'findById' function to simulate an existing user
		mockPostgresUsersRepository.findById = jest.fn().mockResolvedValue({
			id: uuidv4(), // Generate a valid UUID
			name: "user",
			email: "user@user.com",
			password: "OldPassword123@",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		updateUserUseCase = new UpdateUserUseCase(mockPostgresUsersRepository);
	});

	it("should update the user successfully", async () => {
		const userUpdateData = {
			id: uuidv4(), // Generate a valid UUID for testing
			name: "updated user",
			email: "updateduser@user.com",
			password: "NewPassword123@",
		};

		const updatedUser = await updateUserUseCase.execute(userUpdateData);

		expect(updatedUser.name).toBe(userUpdateData.name);
		expect(updatedUser.email).toBe(userUpdateData.email);
		expect(updatedUser.created_at).toBeDefined();
		expect(updatedUser.updated_at).toBeDefined();
		expect(mockPostgresUsersRepository.update).toHaveBeenCalledWith(
			expect.objectContaining({
				id: userUpdateData.id,
				name: userUpdateData.name,
				email: userUpdateData.email,
				password: "HashedPassword123@", // Ensure the hashed password is passed
			})
		);
	});

	it("should throw an error if the user doesn't exist", async () => {
		// Mocking findById to return null (user not found)
		mockPostgresUsersRepository.findById = jest
			.fn()
			.mockResolvedValue(null);

		await expect(
			updateUserUseCase.execute({
				id: uuidv4(), // Generate a valid UUID for testing
				name: "user",
				email: "user@user.com",
				password: "Password123@",
			})
		).rejects.toThrow("User does not exist"); // Adjusting to check the correct message

		// Verifying that findById was called with the correct ID
		expect(mockPostgresUsersRepository.findById).toHaveBeenCalledWith(
			expect.any(String)
		);
	});

	it("should not update fields that are not provided", async () => {
		const userUpdateData = {
			id: uuidv4(), // Generate a valid UUID for testing
			email: "updateduser@user.com",
		};

		const updatedUser = await updateUserUseCase.execute(userUpdateData);

		expect(updatedUser.name).toBe("user"); // Ensuring name remains the same
		expect(updatedUser.email).toBe(userUpdateData.email); // Email should be updated
		expect(mockPostgresUsersRepository.update).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "user", // Ensuring name is not updated
				email: userUpdateData.email,
				password: "OldPassword123@", // Ensuring password is not changed
			})
		);
	});

	it("should hash the new password if provided", async () => {
		const userUpdateData = {
			id: uuidv4(), // Generate a valid UUID for testing
			password: "NewPassword123@",
		};

		await updateUserUseCase.execute(userUpdateData);

		// Ensuring bcrypt.hash is called with the new password
		expect(bcrypt.hash).toHaveBeenCalledWith(
			"NewPassword123@",
			expect.any(Number)
		);
	});

	it("should throw an error if the repository fails to update the user", async () => {
		// Mocking a failure in the repository's update method
		mockPostgresUsersRepository.update.mockRejectedValue(
			new Error("Failed to update")
		);

		await expect(
			updateUserUseCase.execute({
				id: uuidv4(), // Generate a valid UUID for testing
				name: "updated user",
				email: "updateduser@user.com",
				password: "NewPassword123@",
			})
		).rejects.toThrow("Failed to update");
	});
});
