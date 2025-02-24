"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatRoomController_1 = require("../controllers/chatRoomController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/create", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["customer"]), chatRoomController_1.createChatRoom);
router.get("/user/:userId", authMiddleware_1.authenticate, chatRoomController_1.getChatRoomsByUserId);
router.get("/:roomId", authMiddleware_1.authenticate, chatRoomController_1.getChatRoomById);
exports.default = router;
