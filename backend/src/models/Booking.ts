import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  customer: mongoose.Types.ObjectId;
  artisan: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  booking_date: Date;
  status: "pending" | "accepted" | "rejected" | "completed";
}

const BookingSchema = new Schema<IBooking>(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to Customer
    artisan: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to Artisan
    service: { type: Schema.Types.ObjectId, ref: "ArtisanInfo", required: true }, // Reference to Artisan Info
    booking_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);
