import jwt from "jsonwebtoken";
import { generateToken } from "../generateToken";
import { CustomError, ErrorCatalog } from "../../errors/CustomError";

jest.mock("jsonwebtoken");

describe("generateToken", () => {
	const mockUserId = "12345";
	const mockSecretKey = "mockSecretKey";

	beforeEach(() => {
		process.env.JWT_SECRET_KEY = mockSecretKey;
	});

	afterEach(() => {
		delete process.env.JWT_SECRET_KEY;
		jest.clearAllMocks();
	});

	it("deve gerar um token válido", () => {
		const mockSign = jest.fn().mockReturnValue("mockToken");
		(jwt.sign as jest.Mock) = mockSign;

		const token = generateToken(mockUserId);

		expect(mockSign).toHaveBeenCalledWith(
			{ userId: mockUserId },
			mockSecretKey,
			{ expiresIn: "1h" }
		);
		expect(token).toBe("mockToken");
	});

	it("deve lançar um erro customizado se a chave secreta não estiver definida", () => {
		delete process.env.JWT_SECRET_KEY;

		try {
			generateToken(mockUserId);
		} catch (error) {
			expect(error).toBeInstanceOf(CustomError);
			expect((error as CustomError).errorName).toEqual(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_SECRET_KEY
					.errorName
			);
			expect((error as CustomError).message).toEqual(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_SECRET_KEY
					.message
			);
			expect((error as CustomError).statusCode).toEqual(
				ErrorCatalog.ERROR.USER.AUTHENTICATION.INVALID_SECRET_KEY
					.statusCode
			);
		}
	});
});
