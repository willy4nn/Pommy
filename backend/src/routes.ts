import { Router } from "express"; // Import the Router class from Express
import { createUserController } from "./useCases/User/CreateUser";

const router = Router(); // Create a new instance of the router

// POST route to create a new user
router.post("/users", (request, response, next) => {
	return createUserController.handle(request, response, next);
});

export { router }; // Export the router for use in other modules
