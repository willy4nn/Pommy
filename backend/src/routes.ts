import { Router } from "express";
import { createUserController } from "./useCases/CreateUser";
import { updateUserController } from "./useCases/UpdateUser";
import { deleteUserController } from "./useCases/DeleteUser";
import { loginUserController } from "./useCases/LoginUser";
import { authenticateJWT } from "./middlewares/authenticateJWT";

const router = Router();

router.post("/users", (request, response) => {
	return createUserController.handle(request, response);
});

router.put("/users", authenticateJWT, (request, response) => {
	return updateUserController.handle(request, response);
});

router.delete("/users/:id", authenticateJWT, (request, response) => {
	return deleteUserController.handle(request, response);
});

router.post("/login", (request, response) => {
	return loginUserController.handle(request, response);
});

export { router };
