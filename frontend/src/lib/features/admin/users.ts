import config from "@/config/config";
import { getCookie } from "@/utils/storage";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface IUnverifiedArtisanData {
  data: {
    _id: string;
    user: {
      _id: string;
      fname: string;
      lname: string;
      phone: string;
      city: string;
      state: string;
      email: string;
    };
    skills: string;
    profilePicture: string;
    meansOfId: string[];
  }[];
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
    prepareHeaders(headers) {
      const token = getCookie("ad_token");
      if (!token || token === "undefined") {
        return headers;
      }
      headers.set("authorization", `Bearer ${token}`);
    },
  }),
  endpoints: (builder) => ({
    getUnverifiedArtisans: builder.query<IUnverifiedArtisanData, void>({
      query: () => ({
        url: "/api/users/get-unverified-artisans",
      }),
    }),
    acceptUnverifiedArtisan: builder.mutation<unknown, string>({
      query: (id) => ({
        url: `/api/users/send-verification-email/${id}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLazyGetUnverifiedArtisansQuery,
  useAcceptUnverifiedArtisanMutation,
} = userApi;
