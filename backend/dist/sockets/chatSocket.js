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
const ChatRoom_1 = require("../models/ChatRoom");
const chatSocketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        // Join a room
        socket.on("joinRoom", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId }) {
            if (!roomId)
                return;
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        }));
        // Send message
        socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, _id, message, userType }) {
            if (!roomId || !message)
                return;
            // Save message to database
            const chatRoom = yield ChatRoom_1.ChatRoom.findOne({ roomId });
            if (!chatRoom) {
                console.log("Chat room not found");
                return;
            }
            const newMessage = {
                _id: Date.now().toString(),
                text: message,
                timestamp: new Date(),
                userType, // "customer" or "artisan"
            };
            chatRoom.messages.push(newMessage);
            yield chatRoom.save();
            // Broadcast message to room
            io.to(roomId).emit("receiveMessage", newMessage);
        }));
        // Handle disconnect
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
exports.default = chatSocketHandler;
