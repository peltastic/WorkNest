import React, { useEffect, useRef, useState } from "react";
import Spinner from "../Spinner";
import { IChatMessages, ISingleRoomResponse } from "@/lib/features/chat";
import { io, Socket } from "socket.io-client";
import config from "@/config/config";
import { AspectRatio } from "@mantine/core";
import { FaUser } from "react-icons/fa6";

type Props = {
  isFetching?: boolean;
  data: ISingleRoomResponse;
  type: "artisan" | "customer";
};

// export interface IChatMessages {
//     _id: string;
//     userType: "customer" | "artisan"; // User type (customer or artisan)
//     text: string;
//     timestamp: Date;
// }

const socket: Socket = io(config.API_URL || "http://localhost:5000");

const ChatRight = (props: Props) => {
  const [messages, setMessages] = useState<IChatMessages[]>(
    props.data?.messages || []
  );
  const [message, setMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!props.data?.roomId) return;

    socket.emit("joinRoom", { roomId: props.data.roomId });

    // Listen for incoming messages

    socket.on("receiveMessage", (newMessage) => {
      if (props.type !== newMessage.userType) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [props.data?.roomId]);
  useEffect(() => {
 if (props.data) {
    setMessages(props.data.messages)
 }
  }, [props.data])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      roomId: props.data.roomId,
      message,
      userType: props.type,
    };

    socket.emit("sendMessage", newMessage);
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        text: message,
        timestamp: new Date(),
        userType: props.type,
      },
    ]); // Optimistic UI update
    setMessage("");
  };

  return (
    <div className="w-[75%]  relative border  ">
      <div className="h-[90vh]">
        {props.isFetching ? (
          <div className=" h-full flex items-center justify-center">
            <div className="w-[2rem]">
              <Spinner dark />
            </div>
          </div>
        ) : (
          <div className="">
            <div className="py-6 px-10 bg-bg1">
              <h1 className="text-3xl font-medium">
                {props.type === "artisan"
                  ? props.data.userRoomName
                  : props.data.artisanRoomName}
              </h1>
            </div>
            <div className="h-[70vh] p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex items-center ${
                    msg.userType === props.type
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {msg.userType !== props.type && (
                    <div className="mr-2">
                      {msg.userType === "artisan" ? (
                        <div className="w-[2.5rem] h-[2.5rem]">
                          <AspectRatio ratio={1800 / 1800}>
                            <img
                              src={props.data.artisanId.profilePicture}
                              alt="profile-picture"
                              className="w-full h-full rounded-full border border-primary"
                            />
                          </AspectRatio>
                        </div>
                      ) : (
                        <div className="bg-tertiary h-[2.5rem] w-[2.5rem] rounded-full flex justify-center items-center">
                          <FaUser />
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg ${
                      msg.userType === props.type
                        ? "bg-tertiary text-black"
                        : "bg-gray-300"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t flex items-center absolute w-full bottom-0">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                className="ml-2 px-4 py-2 bg-secondary text-white rounded-lg"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRight;
