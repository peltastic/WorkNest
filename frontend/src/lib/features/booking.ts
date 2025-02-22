import config from "@/config/config";
import { getCookie } from "@/utils/storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
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
    createBooking: builder.mutation<
      unknown,
      {
        artisanId: string;
        serviceId: string;
      }
    >({
      query: (body) => ({
        url: "/api/bookings/create-booking",
        body,
        method: "POST",
      }),
    }),
  }),
});


export const {useCreateBookingMutation} = bookingApi