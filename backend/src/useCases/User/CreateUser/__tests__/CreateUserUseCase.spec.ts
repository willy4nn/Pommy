import { CreateUserUseCase } from "../CreateUserUseCase";
import { PostgresUsersRepository } from "../../../../repositories/implementations/PostgresUsersRepository";
import bcrypt from "bcrypt";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { User } from "../../../../entities/User";

// Mocking the repository and bcrypt
jest.mock(
	"../../../../repositories/implementations/PostgresUsersRepository.ts"
);
jest.mock("bcrypt", () => ({
	...jest.requireActual("bcrypt"),
	hash: jest.fn().mockResolvedValue("Password123@"), // Mock hash
}));

describe("CreateUserUseCase (Unit Tests)", () => {
	let createUserUseCase: CreateUserUseCase;
	let mockPostgresUsersRepository: jest.Mocked<PostgresUsersRepository>;

	beforeEach(() => {
		// Initialize the mocked repository and mock its methods
		mockPostgresUsersRepository =
			new PostgresUsersRepository() as jest.Mocked<PostgresUsersRepository>;

		// Create a User entity instance with name, email, and password
		const user = new User({
			name: "user",
			email: "user@user.com",
			password: "Password123@", // Password will be handled in the entity constructor
		});

		// Mocking the save method to return the user instance with created_at and updated_at
		mockPostgresUsersRepository.save = jest.fn().mockResolvedValue(user);

		// Mocking the findByEmail method to return null (indicating no existing user)
		mockPostgresUsersRepository.findByEmail = jest
			.fn()
			.mockResolvedValue(null);

		// Initialize the use case
		createUserUseCase = new CreateUserUseCase(mockPostgresUsersRepository);
	});

	// Error cases first

	it("should throw a CustomError if the user already exists", async () => {
		const user = new User({
			name: "user",
			email: "user@user.com",
			password: "Password123@",
		});

		mockPostgresUsersRepository.findByEmail.mockResolvedValueOnce(user);

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.SERVICE.USER_ALREADY_EXISTS
		);

		await expect(
			createUserUseCase.execute({
				name: "user",
				email: "user@user.com",
				password: "Password123@",
			})
		).rejects.toThrow(error);

		expect(mockPostgresUsersRepository.findByEmail).toHaveBeenCalledWith(
			"user@user.com"
		);
	});

	it("should throw a CustomError if the repository fails to save the user", async () => {
		mockPostgresUsersRepository.save.mockRejectedValueOnce(
			new CustomError(ErrorCatalog.ERROR.USER.REPOSITORY.USER_SAVE_FAILED)
		);

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.REPOSITORY.USER_SAVE_FAILED
		);

		await expect(
			createUserUseCase.execute({
				name: "user",
				email: "user@user.com",
				password: "Password123@",
			})
		).rejects.toThrow(error);
	});

	it("should throw an error if the email format is invalid", async () => {
		const invalidEmail = "invalidemail";
		const password = "Password123@";

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.INVALID_EMAIL_FORMAT
		);

		await expect(
			createUserUseCase.execute({
				name: "user",
				email: invalidEmail,
				password,
			})
		).rejects.toThrow(error);
	});

	it("should throw an error if the password is too short", async () => {
		const shortPassword = "short";
		const email = "user@user.com";

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.PASSWORD_TOO_SHORT
		);

		await expect(
			createUserUseCase.execute({
				name: "user",
				email,
				password: shortPassword,
			})
		).rejects.toThrow(error);
	});

	it("should throw an error if the name is empty", async () => {
		const name = "";
		const email = "user@user.com";
		const password = "Password123@";

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.NAME_REQUIRED
		);

		await expect(
			createUserUseCase.execute({
				name,
				email,
				password,
			})
		).rejects.toThrow(error);
	});

	it("should throw an error if the password does not meet complexity requirements", async () => {
		const weakPassword = "password";
		const email = "user@user.com";

		const error = new CustomError(
			ErrorCatalog.ERROR.USER.VALIDATION.PASSWORD_NO_UPPERCASE
		);

		await expect(
			createUserUseCase.execute({
				name: "user",
				email,
				password: weakPassword,
			})
		).rejects.toThrow(error);
	});

	// Success cases

	it("should save the user with the provided information", async () => {
		const name = "user";
		const email = "user@user.com";
		const password = "Password123@";

		const userCreated = await createUserUseCase.execute({
			name,
			email,
			password,
		});

		expect(userCreated.name).toBe(name);
		expect(userCreated.email).toBe(email);
		expect(userCreated.created_at).toBeDefined();
		expect(userCreated.updated_at).toBeDefined();
		expect(new Date(userCreated.created_at).getTime()).toBeGreaterThan(0);
		expect(new Date(userCreated.updated_at).getTime()).toBeGreaterThan(0);

		expect(mockPostgresUsersRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({
				name,
				email,
				password: "Password123@", // Ensure the password is passed correctly
			})
		);
	});

	it("should hash the password before saving", async () => {
		// Mock bcrypt.hash to ensure it is called correctly
		const bcryptHashMock = jest
			.fn()
			.mockResolvedValue("HashedPassword123@");
		bcrypt.hash = bcryptHashMock;

		// Call the execute method of the UseCase
		await createUserUseCase.execute({
			name: "user",
			email: "user@user.com",
			password: "Password123@", // Original password
		});

		// Ensure bcrypt.hash was called with correct parameters
		expect(bcryptHashMock).toHaveBeenCalledTimes(1);
		expect(bcryptHashMock).toHaveBeenCalledWith(
			"Password123@",
			expect.any(Number)
		);

		// Ensure save method was called with the hashed password
		expect(mockPostgresUsersRepository.save).toHaveBeenCalledWith(
			expect.objectContaining({
				password: "HashedPassword123@", // The hashed password
			})
		);
	});
});
