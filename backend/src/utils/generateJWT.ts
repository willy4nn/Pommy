import jwt from "jsonwebtoken";

export const generateToken = (userId: string, userEmail: string) => {

	const payload = {
		sub: userId,
		email: userEmail,
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
		expiresIn: "1h",
	});

	return token;
};
