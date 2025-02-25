import express from "express";
import { createChatRoom, getChatRoomsByUserId, getChatRoomById, getChatRoomByArtisanId, sendMessage } from "../controllers/chatRoomController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create", authenticate, authorize(["customer", "artisan"]),  createChatRoom);
router.get("/user", authenticate, authorize(["customer"]), getChatRoomsByUserId);
router.get("/artisan", authenticate, authorize(["artisan"]), getChatRoomByArtisanId);
router.get("/getRoom/:roomId", authenticate, getChatRoomById);
router.post("/send-message/:roomId", authenticate, authorize(["artisan", "customer"]), sendMessage)

export default router;
