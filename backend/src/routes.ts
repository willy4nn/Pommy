import { Router } from "express"; // Import the Router class from Express
import { createUserController } from "./useCases/User/CreateUser";
import { loginUserController } from "./useCases/Auth/Login";
import { authMiddleware } from "./middlewares/authMiddleware";

const router = Router(); // Create a new instance of the router

// POST route to create a new user
router.post("/users", (request, response, next) => {
	return createUserController.handle(request, response, next);
});

// POST to route to login
router.post("/login", (request, response, next) => {
	return loginUserController.handle(request, response, next);
});

export { router }; // Export the router for use in other modules
