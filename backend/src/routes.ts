import { Router } from "express"; // Import the Router class from Express
import { createUserController } from "./useCases/User/CreateUser";
import { loginUserController } from "./useCases/Auth/Login";
import { logoutUserController } from "./useCases/Auth/Logout";
import { updateUserController } from "./useCases/User/UpdateUser";
import { authMiddleware } from "./middlewares/authMiddleware";
import { deleteUserController } from "./useCases/User/DeleteUser";

const router = Router(); // Create a new instance of the router

// POST route to create a new user
router.post("/users", (request, response, next) => {
	return createUserController.handle(request, response, next);
});

// POST route to log in a user
router.post("/login", (request, response, next) => {
	return loginUserController.handle(request, response, next);
});

// POST route to log out a user
router.post("/logout", (request, response, next) => {
	return logoutUserController.handle(request, response, next);
});

// PUT route to update a user
router.put("/users", authMiddleware, (request, response, next) => {
	return updateUserController.handle(request, response, next);
});

// DELETE route to delete a user
router.delete("/users", authMiddleware, (request, response, next) => {
	return deleteUserController.handle(request, response, next);
});

export { router }; // Export the router for use in other modules
