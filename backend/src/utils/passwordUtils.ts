import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
	inputPassword: string,
	storedHash: string
) => {
	return await bcrypt.compare(inputPassword, storedHash);
};
