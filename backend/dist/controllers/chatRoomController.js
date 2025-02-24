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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatRoomById = exports.getChatRoomsByUserId = exports.createChatRoom = void 0;
const ChatRoom_1 = require("../models/ChatRoom");
// ✅ Create a Chat Room
const createChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, roomName, userId } = req.body;
        if (!roomId || !userId) {
            return res.status(400).json({ message: "roomId and userId are required" });
        }
        const existingRoom = yield ChatRoom_1.ChatRoom.findOne({ roomId });
        if (existingRoom) {
            return res.status(400).json({ message: "Chat room with this ID already exists" });
        }
        const newChatRoom = new ChatRoom_1.ChatRoom({ roomId, roomName, userId, messages: [] });
        yield newChatRoom.save();
        res.status(201).json({ message: "Chat room created successfully", chatRoom: newChatRoom });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating chat room", error });
    }
});
exports.createChatRoom = createChatRoom;
// ✅ Get All Chat Rooms for a User
const getChatRoomsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        const chatRooms = yield ChatRoom_1.ChatRoom.find({ userId });
        res.status(200).json(chatRooms);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching chat rooms", error });
    }
});
exports.getChatRoomsByUserId = getChatRoomsByUserId;
// ✅ Get a Single Chat Room by roomId
const getChatRoomById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            return res.status(400).json({ message: "roomId is required" });
        }
        const chatRoom = yield ChatRoom_1.ChatRoom.findOne({ roomId });
        if (!chatRoom) {
            return res.status(404).json({ message: "Chat room not found" });
        }
        res.status(200).json(chatRoom);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching chat room", error });
    }
});
exports.getChatRoomById = getChatRoomById;
