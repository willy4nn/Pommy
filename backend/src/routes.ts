import { Router } from "express"; // Import the Router class from Express

const router = Router(); // Create a new instance of the router

// POST route to create a new user
router.post("/users", (request, response) => {
	return response.status(201).send(); // Send a 201 status to indicate resource creation
});

export { router }; // Export the router for use in other modules
