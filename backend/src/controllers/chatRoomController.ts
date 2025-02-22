import { Request, Response } from "express";
import { ChatRoom } from "../models/ChatRoom";

// ✅ Create a Chat Room
export const createChatRoom = async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomId, roomName, userId } = req.body;

    if (!roomId || !userId) {
      return res.status(400).json({ message: "roomId and userId are required" });
    }

    const existingRoom = await ChatRoom.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: "Chat room with this ID already exists" });
    }

    const newChatRoom = new ChatRoom({ roomId, roomName, userId, messages: [] });
    await newChatRoom.save();

    res.status(201).json({ message: "Chat room created successfully", chatRoom: newChatRoom });
  } catch (error) {
    res.status(500).json({ message: "Error creating chat room", error });
  }
};

// ✅ Get All Chat Rooms for a User
export const getChatRoomsByUserId = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const chatRooms = await ChatRoom.find({ userId });
    
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat rooms", error });
  }
};

// ✅ Get a Single Chat Room by roomId
export const getChatRoomById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ message: "roomId is required" });
    }

    const chatRoom = await ChatRoom.findOne({ roomId });

    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat room", error });
  }
};
