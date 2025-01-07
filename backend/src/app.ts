import express from "express"; // Import Express library
import { router } from "./routes"; // Import defined routes

const app = express(); // Create an Express application instance
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(router); // Register imported routes with the application

export { app }; // Export the application instance for use in other modules
