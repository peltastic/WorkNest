import { Request, Response } from "express";
import { ChatRoom } from "../models/ChatRoom";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import path from "path";
import { ArtisanInfo } from "../models/Artisan";
import mongoose from "mongoose";

// ✅ Create a Chat Room
export const createChatRoom = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const { roomId, artisanRoomName, artisanId } = req.body;
    const userId = req.userId;
    if (!roomId) {
      return res
        .status(400)
        .json({ message: "roomId and userId are required" });
    }
    const user = await User.findById(userId).select(["fname", "lname"]);
    const existingRoom = await ChatRoom.findOne({ artisanId: roomId, userId });

    if (existingRoom) {
      return res
        .status(200)
        .json({ message: "Chat room already created", next: true });
    }

    const newChatRoom = new ChatRoom({
      roomId: roomId + req.userId,
      userRoomName: `${user?.fname} ${user?.lname}`,
      userId,
      artisanId,
      artisanRoomName,
      messages: [],
    });
    await newChatRoom.save();
    res.status(201).json({
      message: "Chat room created successfully",
      // chatRoom: newChatRoom,
      next: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating chat room", error });
  }
};

// ✅ Get All Chat Rooms for a User
export const getChatRoomsByUserId = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const chatRooms = await ChatRoom.find({ userId })
      .populate({
        path: "artisanId",
        select: "user _id skills profilePicture",
        populate: { path: "user", select: "fname lname city state" },
      })
      .exec();

    res.status(200).json({ data: chatRooms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat rooms", error });
  }
};
export const getChatRoomByArtisanId = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    const artisanInfo = await ArtisanInfo.findOne({ user: userId });

    const chatRooms = await ChatRoom.find({
      artisanId: artisanInfo?._id,
    }).populate({
      path: "userId",
      select: "fname lname createdAt",
    });

    res.status(200).json({ data: chatRooms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat rooms", error });
  }
};

// ✅ Get a Single Chat Room by roomId
export const getChatRoomById = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const chatRoom = await ChatRoom.findOne({ roomId })
      .populate({
        path: "userId",
        select: "fname lname createdAt",
      })
      .populate({
        path: "artisanId",
        select: "user _id skills profilePicture",
        populate: { path: "user", select: "fname lname city state" },
      });

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat room", error });
  }
};

export const sendMessage = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { roomId, text, userId, userType } = req.body;

    if (!roomId || !text || !userId || !userType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the chat room
    const chatRoom = await ChatRoom.findOne({ roomId });

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    // Create a new message
    const newMessage = {
      _id: new mongoose.Types.ObjectId().toString(),
      userType,
      text,
      timestamp: new Date(),
    };

    // Add message to the chat room
    chatRoom.messages.push(newMessage);
    await chatRoom.save();

    return res.status(201).json({ message: "Message sent", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
