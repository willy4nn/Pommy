import { DecodedToken } from "../../types/DecodedToken"; // Import the DecodedToken type
declare global {
	namespace Express {
		export interface Request {
			user?: DecodedToken; // Define req.user with the `DecodedToken` type
		}
	}
}
