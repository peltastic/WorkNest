import { Request, Response } from "express";
import { Booking } from "../models/Booking";
import User from "../models/User";
import { ArtisanInfo } from "../models/Artisan";
import { AuthRequest } from "../middleware/authMiddleware";

export const createBooking = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { artisanId, serviceId } = req.body;
    const customerId = req.userId; // Extracted from middleware (ensure authentication middleware is used)

    if (!artisanId || !serviceId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if artisan and service exist
    const artisan = await User.findById(artisanId);
    const service = await ArtisanInfo.findById(serviceId);

    if (!artisan || !service) {
      return res.status(404).json({ message: "Artisan or Service not found" });
    }

    // Create booking
    const booking = new Booking({
      customer: customerId,
      artisan: artisanId,
      service: serviceId,
      booking_date: Date.now(),
      status: "pending",
    });

    await booking.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("customer", "fname lname email") // Fetch customer details
      .populate("artisan", "fname lname email phone") // Fetch artisan details
      .populate("service"); // Fetch artisan info

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
};
