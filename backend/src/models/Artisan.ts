import mongoose, { Schema, Document } from "mongoose";

interface IFeedback {
  customer_name: string;
  feedback: string;
}

// Interface for Artisan Info
interface IArtisanInfo extends Document {
  user: mongoose.Types.ObjectId; // Reference to User
  skills: string;
  images: string[]; // URLs of work images
  profilePicture: string; // URL of profile picture
  meansOfId: string[];
  rating: number;
  feedbacks: IFeedback[];
  verified: boolean;
}

// ArtisanInfo Schema
const ArtisanInfoSchema = new Schema<IArtisanInfo>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    skills: { type: String, required: true },
    images: { type: [String], default: [] },
    meansOfId: { type: [String], default: [] },
    profilePicture: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    feedbacks: [
      {
        customer_name: { type: String, required: true },
        feedback: { type: String, required: true },
      },
    ],
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ArtisanInfo = mongoose.model<IArtisanInfo>(
  "ArtisanInfo",
  ArtisanInfoSchema
);
