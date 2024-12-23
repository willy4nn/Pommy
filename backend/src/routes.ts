import { Router } from "express"; // Import the Router class from Express
import { createUserController } from "./useCases/User/CreateUser";
import { updateUserController } from "./useCases/User/UpdateUser";
import { deleteUserController } from "./useCases/User/DeleteUser";
import { loginUserController } from "./useCases/User/LoginUser";
import { logoutUserController } from "./useCases/User/LogoutUser";
import { authMiddleware } from "./middlewares/authMiddleware";

const router = Router(); // Create a new instance of the router

// POST route to create a new user (no authentication required)
router.post("/users", (request, response, next) => {
	return createUserController.handle(request, response, next);
});

// PUT route to update a user (authentication required)
router.put("/users", authMiddleware, (request, response, next) => {
	return updateUserController.handle(request, response, next);
});

// DELETE to delete a user (authentication required)
router.delete("/users", authMiddleware, (request, response, next) => {
	return deleteUserController.handle(request, response, next);
});

// POST to login (no authentication required)
router.post("/login", (request, response, next) => {
	return loginUserController.handle(request, response, next);
});

// POST to logout (no authentication required)
router.post("/logout", (request, response, next) => {
	return logoutUserController.handle(request, response, next);
});

export { router }; // Export the router for use in other modules
