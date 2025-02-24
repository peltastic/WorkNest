"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookingController_1 = require("../controllers/bookingController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/create-booking", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["customer"]), bookingController_1.createBooking);
router.get("/get-bookings", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["artisan"]), bookingController_1.getBookingsForArtisan);
router.get("/get-booking/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)(["customer"]), bookingController_1.getBookingById);
exports.default = router;
