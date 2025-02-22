import express from "express";
import { createChatRoom, getChatRoomsByUserId, getChatRoomById } from "../controllers/chatRoomController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create", authenticate, authorize(["customer"]),  createChatRoom);
router.get("/user/:userId", authenticate, getChatRoomsByUserId);
router.get("/:roomId", authenticate, getChatRoomById);

export default router;
