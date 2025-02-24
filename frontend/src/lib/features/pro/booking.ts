import config from "@/config/config";
import { getCookie } from "@/utils/storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IArtisanBookingResponse {
  totalBookings: number;
  bookings: {
    _id: string;
    customer: {
      _id: string;
      fname: string;
      lname: string;
      email: string;
      phone: string;
      city: string;
      state: string;
    };
    artisan: string;
    service: {
      _id: string;
      skills: string;
      profilePicture: string;
    };
    booking_date: string;
    status: "pending";
    createdAt: string;
  }[];
}

export const artisanBookingApi = createApi({
  reducerPath: "artisanBookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
    prepareHeaders(headers, api) {
      const token = getCookie("ar_token");
      if (!token || token === "undefined") {
        return headers;
      }
      headers.set("authorization", `Bearer ${token}`);
    },
  }),
  endpoints: (builder) => ({
    getArtisanBooking: builder.query<IArtisanBookingResponse, void>({
      query: () => `/api/bookings/get-bookings`,
    }),
  }),
});

export const { useLazyGetArtisanBookingQuery } = artisanBookingApi;
