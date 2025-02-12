import bcrypt from "bcrypt";
import { LoginUserUseCase } from "../LoginUserUseCase";
import { IUsersRepository } from "../../../../repositories/IUsersRepository";
import { CustomError, ErrorCatalog } from "../../../../errors/CustomError";
import { generateToken } from "../../../../helpers/generateToken";

// Mock dependencies
jest.mock("bcrypt");
jest.mock("../../../../helpers/generateToken");

describe("LoginUserUseCase", () => {
	const mockUsersRepository: jest.Mocked<IUsersRepository> = {
		findByEmail: jest.fn(),
		// ... add other repository methods if needed
	} as unknown as jest.Mocked<IUsersRepository>;

	const loginUserUseCase = new LoginUserUseCase(mockUsersRepository);

	afterEach(() => {
		jest.clearAllMocks();
	});

	// Updated mockUser matching the User type requirements
	const mockUser = {
		id: "1",
		email: "test@example.com",
		password: "hashedPassword",
		createdAt: new Date(),
		name: "Test User",
		updatedAt: new Date(),
	};

	it("should throw INVALID_CREDENTIALS error when email is not provided", async () => {
		await expect(
			loginUserUseCase.execute({ email: "", password: "password123" })
		).rejects.toThrowError(CustomError);

		await expect(
			loginUserUseCase.execute({ email: "", password: "password123" })
		).rejects.toMatchObject({
			errorName:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.errorName,
			message:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.message,
			statusCode:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.statusCode,
		});
	});

	it("should throw INVALID_CREDENTIALS error when password is not provided", async () => {
		await expect(
			loginUserUseCase.execute({
				email: "test@example.com",
				password: "",
			})
		).rejects.toThrowError(CustomError);

		await expect(
			loginUserUseCase.execute({
				email: "test@example.com",
				password: "",
			})
		).rejects.toMatchObject({
			errorName:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.errorName,
			message:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.message,
			statusCode:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.statusCode,
		});
	});

	it("should throw INVALID_CREDENTIALS error when user does not exist", async () => {
		mockUsersRepository.findByEmail.mockResolvedValueOnce(null);

		await expect(
			loginUserUseCase.execute({
				email: "nonexistent@example.com",
				password: "password123",
			})
		).rejects.toThrowError(CustomError);

		await expect(
			loginUserUseCase.execute({
				email: "nonexistent@example.com",
				password: "password123",
			})
		).rejects.toMatchObject({
			errorName:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.errorName,
			message:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.message,
			statusCode:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.statusCode,
		});

		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			"nonexistent@example.com"
		);
	});

	it("should throw INVALID_CREDENTIALS error when password is invalid", async () => {
		mockUsersRepository.findByEmail.mockResolvedValueOnce(mockUser);
		(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

		await expect(
			loginUserUseCase.execute({
				email: "test@example.com",
				password: "wrongPassword",
			})
		).rejects.toThrowError(CustomError);

		await expect(
			loginUserUseCase.execute({
				email: "test@example.com",
				password: "wrongPassword",
			})
		).rejects.toMatchObject({
			errorName:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.errorName,
			message:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.message,
			statusCode:
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_CREDENTIALS
					.statusCode,
		});

		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			"test@example.com"
		);
		expect(bcrypt.compare).toHaveBeenCalledWith(
			"wrongPassword",
			"hashedPassword"
		);
	});

	it("should return a token when email and password are valid", async () => {
		mockUsersRepository.findByEmail.mockResolvedValueOnce(mockUser);
		(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
		(generateToken as jest.Mock).mockReturnValue("mockToken");

		const token = await loginUserUseCase.execute({
			email: "test@example.com",
			password: "validPassword",
		});

		expect(token).toBe("mockToken");
		expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(
			"test@example.com"
		);
		expect(bcrypt.compare).toHaveBeenCalledWith(
			"validPassword",
			"hashedPassword"
		);
		expect(generateToken).toHaveBeenCalledWith("1");
	});
});
