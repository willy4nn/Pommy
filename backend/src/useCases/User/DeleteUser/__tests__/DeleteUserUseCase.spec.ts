import { DeleteUserUseCase } from "../DeleteUserUseCase";
import { PostgresUsersRepository } from "../../../../repositories/implementations/PostgresUsersRepository";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { v4 as uuidv4 } from "uuid";

// Mocking the repository
jest.mock("../../../../repositories/implementations/PostgresUsersRepository");

describe("DeleteUserUseCase (Unit Tests)", () => {
	let deleteUserUseCase: DeleteUserUseCase;
	let mockPostgresUsersRepository: jest.Mocked<PostgresUsersRepository>;

	beforeEach(() => {
		mockPostgresUsersRepository =
			new PostgresUsersRepository() as jest.Mocked<PostgresUsersRepository>;

		// Mocking the 'delete' function of the repository
		mockPostgresUsersRepository.delete = jest
			.fn()
			.mockResolvedValue(undefined);

		// Mocking the 'findById' function to simulate an existing user
		mockPostgresUsersRepository.findById = jest.fn().mockResolvedValue({
			id: uuidv4(),
			name: "John Doe",
			email: "johndoe@example.com",
			password: "Password123@",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		deleteUserUseCase = new DeleteUserUseCase(mockPostgresUsersRepository);
	});

	it("should delete the user successfully", async () => {
		const userId = uuidv4(); // Generate a valid UUID for testing

		// Execute the delete
		await deleteUserUseCase.execute({ id: userId });

		// Verifies that the repository 'findById' and 'delete' methods were called
		expect(mockPostgresUsersRepository.findById).toHaveBeenCalledWith(
			userId
		);
		expect(mockPostgresUsersRepository.delete).toHaveBeenCalledWith(userId);

		// Verifies that the delete was performed successfully
		expect(mockPostgresUsersRepository.delete).toHaveBeenCalledTimes(1);
	});

	it("should throw an error if the user doesn't exist", async () => {
		// Mocking findById to return null (user not found)
		mockPostgresUsersRepository.findById.mockResolvedValue(null);

		const userId = uuidv4(); // Generate a valid UUID for testing

		await expect(deleteUserUseCase.execute({ id: userId })).rejects.toThrow(
			new CustomError(ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND)
		);

		// Verifies that findById was called with the correct ID
		expect(mockPostgresUsersRepository.findById).toHaveBeenCalledWith(
			userId
		);

		// Verifies that the delete method was not called when user is not found
		expect(mockPostgresUsersRepository.delete).not.toHaveBeenCalled();
	});

	it("should throw an error if the repository fails to delete the user", async () => {
		// Mocking a failure in the repository's delete method
		mockPostgresUsersRepository.delete.mockRejectedValue(
			new Error("Failed to delete")
		);

		const userId = uuidv4(); // Generate a valid UUID for testing

		await expect(deleteUserUseCase.execute({ id: userId })).rejects.toThrow(
			"Failed to delete"
		);

		// Verifies that delete was called with the correct ID
		expect(mockPostgresUsersRepository.delete).toHaveBeenCalledWith(userId);
	});
});
