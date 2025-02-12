import express from "express"; // Import Express library
import { router } from "./routes"; // Import defined routes
import { errorMiddleware } from "./middlewares/errorMiddleware";
import cookieParser from "cookie-parser";

const app = express(); // Create an Express application instance
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies from incoming requests
app.use(router); // Register imported routes with the application
app.use(errorMiddleware); // Middleware to handle errors

export { app }; // Export the application instance for use in other modules
