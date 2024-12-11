import jwt from "jsonwebtoken";

export function generateToken(userId: string): string {
	// Generate a JWT token with the userId as the payload and set the expiration time to 1 hour
	return jwt.sign({ userId }, process.env.JWT_SECRET_KEY as string, {
		expiresIn: "1h", // Token expires in 1 hour
	});
}
