import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./db/db.js";
import userRoutes from "./routes/user.routes.js";
import captainRoutes from "./routes/captain.routes.js"
import rideRoutes from "./routes/ride.route.js"
import mapsRoutes from './routes/maps.routes.js'
import { initializeSocket } from "./socket.js";
dotenv.config();

const app = express();

// Create HTTP server for socket.io
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect DB
connectDB();

// Initialize socket.io
initializeSocket(server);

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// routes
app.use("/users", userRoutes);

app.use("/captains", captainRoutes);
app.use("/maps", mapsRoutes);
app.use("/rides", rideRoutes);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
