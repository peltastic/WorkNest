import express from "express";
import {
  createBooking,
  getBookingById,
  getBookingsForArtisan,
} from "../controllers/bookingController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/create-booking",
  authenticate,
  authorize(["customer"]),
  createBooking
);

router.get(
  "/get-bookings",
  authenticate,
  authorize(["artisan"]),
  getBookingsForArtisan
);

router.get(
  "/get-booking/:id",
  authenticate,
  authorize(["customer"]),
  getBookingById
);

export default router;
