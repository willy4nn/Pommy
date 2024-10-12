import { Router } from "express";
import { createUserController } from "./useCases/CreateUser";
import { updateUserController } from "./useCases/UpdateUser";

const router = Router();

router.post("/users", (request, response) => {
	return createUserController.handle(request, response);
});

router.put("/users", (request, response) => {
	return updateUserController.handle(request, response);
});

export { router };
