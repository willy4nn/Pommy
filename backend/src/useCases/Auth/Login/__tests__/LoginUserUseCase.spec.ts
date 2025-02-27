import { LoginUserUseCase } from "../LoginUserUseCase";
import { IUsersRepository } from "../../../../repositories/IUsersRepository";
import { generateToken } from "../../../../helpers/generateToken";
import bcrypt from "bcrypt";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { User } from "../../../../entities/User";

// Mock dependencies
jest.mock("../../../../helpers/generateToken");
jest.mock("bcrypt");

describe("Unit Tests - LoginUserUseCase", () => {
	let loginUserUseCase: LoginUserUseCase;
	let usersRepositoryMock: jest.Mocked<IUsersRepository>;

	beforeAll(() => {
		// Create a mocked repository with the correct types
		usersRepositoryMock = {
			findById: jest.fn(),
			findByEmail: jest.fn(),
			save: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		};

		// Create an instance of the use case passing the mocked repository
		loginUserUseCase = new LoginUserUseCase(usersRepositoryMock);
	});

	it("should throw an error when the email is missing", async () => {
		// Test if an error is thrown when email is empty
		await expect(
			loginUserUseCase.execute({ email: "", password: "Password123@" })
		).rejects.toThrow(
			new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
			)
		);
	});

	it("should throw an error when the password is missing", async () => {
		// Test if an error is thrown when password is empty
		await expect(
			loginUserUseCase.execute({ email: "user@email.com", password: "" })
		).rejects.toThrow(
			new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
			)
		);
	});

	it("should throw an error when the user does not exist", async () => {
		// Test if an error is thrown when no user is found for the given email
		await expect(
			loginUserUseCase.execute({
				email: "user@email.com",
				password: "Password123@",
			})
		).rejects.toThrow(
			new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
			)
		);
	});

	it("should throw an error when the password is incorrect", async () => {
		const correctPassword = "Password123@";

		// Create a user with the correct password stored
		const user = new User({
			name: "John Doe",
			email: "user@email.com",
			password: correctPassword,
		});

		// Mock the repository to return the user when searched by email
		usersRepositoryMock.findByEmail.mockResolvedValue(user);

		// Mock bcrypt.compare to return false (password mismatch)
		bcrypt.compare = jest.fn().mockResolvedValue(false);

		// Test if the use case throws an error when the wrong password is provided
		await expect(
			loginUserUseCase.execute({
				email: "user@email.com",
				password: "WrongPassword123@", // Incorrect password
			})
		).rejects.toThrow(
			new CustomError(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
			)
		);
	});

	it("should return a token when authentication is successful", async () => {
		const correctPassword = "Password123@";

		// Create a user with the correct password stored
		const user = new User({
			name: "John Doe",
			email: "user@email.com",
			password: correctPassword,
		});

		// Mock the repository to return the user when searched by email
		usersRepositoryMock.findByEmail.mockResolvedValue(user);

		// Mock bcrypt.compare to return true (correct password)
		bcrypt.compare = jest.fn().mockResolvedValue(true);

		// Mock generateToken to return a generated token
		const token = "generated_token";
		(generateToken as jest.Mock).mockReturnValue(token); // Type cast to ensure it's treated as a mock

		// Execute the login method with correct credentials
		const result = await loginUserUseCase.execute({
			email: "user@email.com",
			password: correctPassword,
		});

		// Assert that the returned token is the one generated
		expect(result).toBe(token);

		// Assert that bcrypt.compare was called with the correct parameters
		expect(bcrypt.compare).toHaveBeenCalledWith(
			correctPassword,
			user.password
		);

		// Assert that generateToken was called with the correct user ID
		expect(generateToken).toHaveBeenCalledWith(user.id);
	});
});
