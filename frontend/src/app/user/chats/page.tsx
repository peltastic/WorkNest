"use client";
import ChatLeft from "@/components/Chat/ChatLeft";
import ChatRight from "@/components/Chat/ChatRight";
import Layout from "@/components/Layout";
import Spinner from "@/components/Spinner";
import {
  ISingleRoomResponse,
  useLazyGetSingleChatRoomQuery,
  useLazyGetUserChatRoomQuery,
} from "@/lib/features/chat";
import { hastoken } from "@/utils/helperFunction";
import { notify } from "@/utils/notification";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

const MessagesPage = (props: Props) => {
  const [chatData, setChatData] = useState<ISingleRoomResponse | null>();
  const router = useRouter();
  const search = useSearchParams();
  const searchVal = search.get("room");
  const [getSingleRoom, result] = useLazyGetSingleChatRoomQuery();
  const [getChatRooms, { isLoading, data }] = useLazyGetUserChatRoomQuery();
  useEffect(() => {
    const hasTokenVal = hastoken("token");
    if (!hasTokenVal) {
      notify("message", "You are out of session please log in");
      return router.push("/auth/login");
    }
  }, []);

  useEffect(() => {
    getChatRooms();
  }, []);

  useEffect(() => {
    if (searchVal) {
      console.log("sjsj");
      getSingleRoom(searchVal as string);
    }
  }, [searchVal]);

  //   useEffect(() => {
  //  if (result.data) {
  //   console.log(result.data)
  //   setChatData(result.data)
  //  }
  //   }, [result.data, result.isFetching])

  return (
    <Layout>
      <div className="flex h-[90vh] mb-10 mt-10">
        {isLoading ? (
          <div className="w-[2rem] ">
            <Spinner />
          </div>
        ) : (
          <>
            {data && (
              <ChatLeft
                type="customer"
                searchVal={searchVal}
                data={data.data.map((el) => {
                  return {
                    body: el.artisanId.skills,
                    id: el.roomId,
                    roomName: el.artisanRoomName,
                    profilePicture: el.artisanId.profilePicture,
                  };
                })}
              />
            )}
          </>
        )}
        {searchVal ? (
          <>
            {result.data && (
              <ChatRight
                data={result.data}
                isFetching={result.isFetching}
                type="customer"
              />
            )}
          </>
        ) : (
          <div className="w-[75%] relative">
            <p className="text-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  text-black">Please select a conversation</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MessagesPage;
