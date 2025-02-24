"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
dotenv_1.default.config();
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const serviceRoute_1 = __importDefault(require("./routes/serviceRoute"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const chatSocket_1 = __importDefault(require("./sockets/chatSocket"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" },
});
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/services", serviceRoute_1.default);
app.use("/api/bookings", bookingRoutes_1.default);
app.use(express_1.default.json());
(0, chatSocket_1.default)(io);
// Connect to MongoDB
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
