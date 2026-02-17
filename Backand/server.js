import dotenv from "dotenv";
dotenv.config();   // ✅ MUST BE FIRST LINE

import express from "express";
import cors from "cors";
import http from "http";

import connectDB from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import captainRoutes from "./routes/captain.routes.js";
import rideRoutes from "./routes/ride.route.js";
import mapsRoutes from "./routes/maps.routes.js";

import { initializeSocket } from "./socket.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

// Initialize socket
initializeSocket(server);

const PORT = process.env.PORT || 4000;

// Debug — remove later
console.log("Geoapify Key:", process.env.GEOAPIFY_API_KEY);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Routes
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/rides", rideRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
