"use client";

import ChatLeft from "@/components/Chat/ChatLeft";
import ChatRight from "@/components/Chat/ChatRight";
import Layout from "@/components/Layout";
import ProLayout from "@/components/Pro/ProLayout";
import Spinner from "@/components/Spinner";
import { useLazyGetUserChatRoomQuery } from "@/lib/features/chat";
import {
  useLazyGetArtisanChatRoomQuery,
  useLazyGetSingleChatRoomQuery,
} from "@/lib/features/pro/chat";
import { hastoken } from "@/utils/helperFunction";
import { notify } from "@/utils/notification";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";

type Props = {};

const ChatPageContent = () => {
  const router = useRouter();
  const [getSingleRoom, result] = useLazyGetSingleChatRoomQuery();
  const search = useSearchParams();
  const searchVal = search.get("room");

  const [getChatRooms, { isLoading, data }] = useLazyGetArtisanChatRoomQuery();

  useEffect(() => {
    const hasTokenVal = hastoken("ar_token");
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
      getSingleRoom(searchVal as string);
    }
  }, [searchVal]);

  return (
    <ProLayout>
      <div className="flex h-[90vh] mb-10 mt-10">
        {isLoading ? (
          <div className="w-[2rem]">
            <Spinner />
          </div>
        ) : (
          <>
            {data && (
              <ChatLeft
                type="artisan"
                data={data.data.map((el) => ({
                  body: moment(el.userId.createdAt).format("ll"),
                  id: el.roomId,
                  roomName: el.userRoomName,
                  profilePicture: "",
                }))}
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
                type="artisan"
              />
            )}
          </>
        ) : (
          <div className="w-[75%] relative">
            <p className="text-2xl absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black">
              Please select a conversation
            </p>
          </div>
        )}
      </div>
    </ProLayout>
  );
};

const ProChatpage = (props: Props) => {
  return (
    <Suspense fallback={<Spinner />}>
      <ChatPageContent />
    </Suspense>
  );
};

export default ProChatpage;
