import { Server, Socket } from "socket.io";
import { ChatRoom } from "../models/ChatRoom";

interface JoinRoomPayload {
  roomId: string;
}

interface SendMessagePayload {
  roomId: string;
  message: string;
  userType: "customer" | "artisan";
}

const chatSocketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Join a room
    socket.on("joinRoom", async ({ roomId }: JoinRoomPayload) => {
      if (!roomId) return;
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Send message
    socket.on(
      "sendMessage",
      async ({ roomId,  message, userType }: SendMessagePayload) => {
        if (!roomId || !message) return;

        // Save message to database
        const chatRoom = await ChatRoom.findOne({ roomId });
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
        await chatRoom.save();

        // Broadcast message to room
        io.to(roomId).emit("receiveMessage", newMessage);
      }
    );

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default chatSocketHandler;
