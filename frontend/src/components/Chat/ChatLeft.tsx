import { AspectRatio } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaUser } from "react-icons/fa6";

type Props = {
  data: {
    profilePicture?: string;
    roomName: string;
    id: string;
    body: string;
  }[];
  searchVal?: string | null;
  type: "artisan" | "customer";
};

const ChatLeft = (props: Props) => {
  const router = useRouter();
  return (
    <div className="flex-1 py-8 px-4 w-[25%] border">
      <h1 className="text-2xl font-semibold mb-8">Conversations</h1>
      {props.data.map((el) => (
        <div
          onClick={() =>
            router.push(
              `/${props.type === "customer" ? "user" : "pro"}/chats?room=${
                el.id
              }`
            )
          }
          className={`${
            props.searchVal === el.id ? "bg-tertiary" : ""
          } flex  items-center py-4 mb-1 rounded-md hover:bg-tertiary transition-all cursor-pointer px-4`}
          key={el.body}
        >
          <div className="mr-4">
            {el.profilePicture ? (
              <div className="w-[3rem] h-[3rem]">
                <AspectRatio ratio={1800 / 1800}>
                  <img
                    src={el.profilePicture}
                    alt="profile-picture"
                    className="w-full h-full rounded-full border border-primary"
                  />
                </AspectRatio>
              </div>
            ) : (
              <div className="bg-tertiary h-[3rem] w-[3rem] rounded-full flex justify-center items-center">
                <FaUser />
              </div>
            )}
          </div>
          <div className="">
            <p className="font-semibold">{el.roomName}</p>
            <p className="font-light text-sm">{el.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatLeft;
