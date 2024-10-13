import { Router } from "express";
import { createUserController } from "./useCases/CreateUser";
import { updateUserController } from "./useCases/UpdateUser";
import { deleteUserController } from "./useCases/DeleteUser";

const router = Router();

router.post("/users", (request, response) => {
	return createUserController.handle(request, response);
});

router.put("/users", (request, response) => {
	return updateUserController.handle(request, response);
});

router.delete("/users", (request, response) => {
	return deleteUserController.handle(request, response);
});


export { router };
