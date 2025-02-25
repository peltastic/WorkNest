import config from "@/config/config";
import { getCookie } from "@/utils/storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ICreateChatPayload {
  roomId: string;
  artisanRoomName: string;
  artisanId: string;
}
export interface IChatMessages {
  _id: string;
  userType: "customer" | "artisan"; // User type (customer or artisan)
  text: string;
  timestamp: Date;
}

export interface IUserChatRoomResponse {
  data: {
    _id: string;
    roomId: string;
    userId: string;
    artisanId: {
      _id: string;
      user: {
        _id: string;
        fname: string;
        lname: string;
        city: string;
        state: string;
      };
      skills: string;
      profilePicture: string;
    };
    userRoomName: "James Ecstasy";
    artisanRoomName: string;
    messages: IChatMessages[];
  }[];
}

export interface ISingleRoomResponse {
  _id: string;
  roomId: string;
  userId: string;
  artisanId: {
    _id: string;
    user: {
      _id: string;
      fname: string;
      lname: string;
      city: string;
      state: string;
    };
    userId: {
      _id: string;
      fname: string;
      lname: string;
      createdAt: string;
    };
    skills: string;
    profilePicture: string;
  };
  userRoomName: "James Ecstasy";
  artisanRoomName: string;
  messages: [];
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
    prepareHeaders(headers) {
      const token = getCookie("token");
      if (!token || token === "undefined") {
        return headers;
      }
      headers.set("authorization", `Bearer ${token}`);
    },
  }),
  endpoints: (builder) => ({
    createChatRoom: builder.mutation<unknown, ICreateChatPayload>({
      query: (body) => ({
        url: "/api/chat/create",
        body,
        method: "POST",
      }),
    }),
    getUserChatRoom: builder.query<IUserChatRoomResponse, void>({
      query: () => `/api/chat/user`,
    }),
    getSingleChatRoom: builder.query<ISingleRoomResponse, string>({
      query: (id) => `/api/chat/getRoom/${id}`,
    }),
  }),
});

export const {
  useCreateChatRoomMutation,
  useLazyGetUserChatRoomQuery,
  useLazyGetSingleChatRoomQuery,
} = chatApi;
