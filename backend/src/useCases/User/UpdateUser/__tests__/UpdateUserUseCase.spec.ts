import { UpdateUserUseCase } from "../UpdateUserUseCase";
import { PostgresUsersRepository } from "../../../../repositories/implementations/PostgresUsersRepository";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";

// Mocking the repository
jest.mock(
	"../../../../repositories/implementations/PostgresUsersRepository.ts"
);
jest.mock("bcrypt", () => ({
	...jest.requireActual("bcrypt"),
	hash: jest.fn().mockResolvedValue("HashedPassword123@"),
}));

describe("UpdateUserUseCase (Unit Tests)", () => {
	let updateUserUseCase: UpdateUserUseCase;
	let mockPostgresUsersRepository: jest.Mocked<PostgresUsersRepository>;

	beforeEach(() => {
		mockPostgresUsersRepository =
			new PostgresUsersRepository() as jest.Mocked<PostgresUsersRepository>;

		mockPostgresUsersRepository.update = jest.fn().mockResolvedValue({
			id: uuidv4(),
			name: "updated user",
			email: "updateduser@user.com",
			password: "HashedPassword123@",
			createdAt: new Date(),
			updatedAt: new Date(),
		});

		mockPostgresUsersRepository.findById = jest.fn().mockResolvedValue({
			id: uuidv4(),
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
			id: uuidv4(),
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
				password: "HashedPassword123@", // Check if password is hashed
			})
		);
	});

	it("should throw an error if the user doesn't exist", async () => {
		// Mocking findById to return null (user not found)
		mockPostgresUsersRepository.findById.mockResolvedValue(null);

		await expect(
			updateUserUseCase.execute({
				id: uuidv4(),
				name: "user",
				email: "user@user.com",
				password: "Password123@",
			})
		).rejects.toThrow(
			new CustomError(ErrorCatalog.ERROR.USER.SERVICE.USER_NOT_FOUND)
		);

		expect(mockPostgresUsersRepository.findById).toHaveBeenCalledWith(
			expect.any(String)
		);
	});

	it("should not update fields that are not provided", async () => {
		const userUpdateData = {
			id: uuidv4(),
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
			id: uuidv4(),
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
			new CustomError(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_UPDATE_FAILED
			)
		);

		await expect(
			updateUserUseCase.execute({
				id: uuidv4(),
				name: "updated user",
				email: "updateduser@user.com",
				password: "NewPassword123@",
			})
		).rejects.toThrow(
			new CustomError(
				ErrorCatalog.ERROR.USER.REPOSITORY.USER_UPDATE_FAILED
			)
		);
	});
});
