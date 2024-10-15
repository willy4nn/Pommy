import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authenticateJWT = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	const token = request.cookies.token;

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
			if (err) {
				return response
					.status(403)
					.json({ message: "Token inválido ou expirado" });
			}

			const user = decoded as JwtPayload;

			request.user = {
				id: user.sub,
				email: user.email,
			};

			next();
		});
	} else {
		return response.status(401).json({ message: "Token não fornecido" });
	}
};
