"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookingsForArtisan = exports.getBookingById = exports.createBooking = void 0;
const Booking_1 = require("../models/Booking");
const User_1 = __importDefault(require("../models/User"));
const Artisan_1 = require("../models/Artisan");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { artisanId, serviceId } = req.body;
        const customerId = req.userId; // Extracted from middleware (ensure authentication middleware is used)
        if (!artisanId || !serviceId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Check if artisan and service exist
        const artisan = yield User_1.default.findById(artisanId);
        const service = yield Artisan_1.ArtisanInfo.findById(serviceId);
        if (!artisan || !service) {
            return res.status(404).json({ message: "Artisan or Service not found" });
        }
        // Create booking
        const booking = new Booking_1.Booking({
            customer: customerId,
            artisan: artisanId,
            service: serviceId,
            booking_date: Date.now(),
            status: "pending",
        });
        yield booking.save();
        res.status(201).json({ message: "Booking created successfully", booking });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating booking", error });
    }
});
exports.createBooking = createBooking;
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const booking = yield Booking_1.Booking.findById(id)
            .populate("customer", "fname lname email") // Fetch customer details
            .populate("artisan", "fname lname email phone") // Fetch artisan details
            .populate("service"); // Fetch artisan info
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.json(booking);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching booking", error });
    }
});
exports.getBookingById = getBookingById;
const getBookingsForArtisan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artisanId = req.userId;
        if (!artisanId) {
            return res.status(400).json({ message: "Artisan ID is required" });
        }
        // Check if the artisan exists
        const artisanExists = yield User_1.default.findById(artisanId);
        if (!artisanExists) {
            return res.status(404).json({ message: "Artisan not found" });
        }
        // Fetch bookings for the artisan and populate references
        const bookings = yield Booking_1.Booking.find({ artisan: artisanId })
            .populate({
            path: "customer",
            select: "fname lname email phone city state",
        })
            .populate({
            path: "service",
            select: "skills profilePicture",
        })
            .sort({ booking_date: -1 }) // Sort by most recent bookings
            .exec();
        res.status(200).json({
            message: "Bookings retrieved successfully",
            totalBookings: bookings.length,
            bookings,
        });
    }
    catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Error fetching bookings", error });
    }
});
exports.getBookingsForArtisan = getBookingsForArtisan;
