import express from "express";
import {
  getUnverifiedArtisans,
  sendVerificationEmailToArtisan,
  setArtisanPassword,
  updateArtisanFeedback,
} from "../controllers/usersController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/get-unverified-artisans",
  authenticate,
  authorize(["admin"]),
  getUnverifiedArtisans
);
router.post(
  "/send-verification-email/:artisanId",
  authenticate,
  authorize(["admin"]),
  sendVerificationEmailToArtisan
);
router.post("/set-artisan-password/:token", setArtisanPassword);
router.post(
  "/post-feedback/:artisanId",
  authenticate,
  authorize(["customer"]),
  updateArtisanFeedback
);
export default router;
