import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  _id: string;
  userType: "customer" | "artisan"; // User type (customer or artisan)
  text: string;
  timestamp: Date;
}

export interface IChatRoom extends Document {
  roomId: string;
  userId: mongoose.Types.ObjectId;
  artisanId: mongoose.Types.ObjectId;
  userRoomName: string;
  artisanRoomName: string;
  messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
  _id: { type: String, required: true },
  userType: { type: String, enum: ["customer", "artisan"], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatRoomSchema = new Schema<IChatRoom>({
  roomId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  artisanId: {
    type: Schema.Types.ObjectId,
    ref: "ArtisanInfo",
    required: true,
  },
  userRoomName: { type: String },
  artisanRoomName: { type: String },
  messages: [MessageSchema],
});

export const ChatRoom = mongoose.model<IChatRoom>("ChatRoom", ChatRoomSchema);
