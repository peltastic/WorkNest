import express from "express";
import dotenv from "dotenv";
import http from "http";
dotenv.config();
import authRoutes from "./routes/authRoutes";
import usersRoutes from "./routes/userRoutes";
import serviceRoutes from "./routes/serviceRoute";
import bookingRoutes from "./routes/bookingRoutes";
import cors from "cors";
import mongoose from "mongoose";
import chatSocketHandler from "./sockets/chatSocket";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(express.json());
chatSocketHandler(io);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
