import config from "@/config/config";
import { getCookie } from "@/utils/storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ISingleRoomResponse } from "../chat";

export interface ICreateChatPayload {
  roomId: string;
  artisanRoomName: string;
  artisanId: string;
}

export interface IUserChatRoomResponse {
  data: {
    _id: string;
    roomId: string;
    artisanId: string;
    userId: {
      _id: string
      fname: string
      lname: string
      createdAt: string
    };
    userRoomName: "James Ecstasy";
    artisanRoomName: string;
    messages: [];
  }[];
}

export const proChatApi = createApi({
  reducerPath: "proChatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
    prepareHeaders(headers) {
      const token = getCookie("ar_token");
      if (!token || token === "undefined") {
        return headers;
      }
      headers.set("authorization", `Bearer ${token}`);
    },
  }),
  endpoints: (builder) => ({
    // createChatRoom: builder.mutation<unknown, ICreateChatPayload>({
    //   query: (body) => ({
    //     url: "/api/chat/create",
    //     body,
    //     method: "POST",
    //   }),
    // }),
    getArtisanChatRoom: builder.query<IUserChatRoomResponse, void>({
      query: () => `/api/chat/artisan`,
    }),
    getSingleChatRoom: builder.query<ISingleRoomResponse, string>({
        query: (id) => `/api/chat/getRoom/${id}`,
      }),
  }),
});

export const { useLazyGetArtisanChatRoomQuery, useLazyGetSingleChatRoomQuery } = proChatApi;
