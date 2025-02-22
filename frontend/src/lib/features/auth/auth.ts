import config from "@/config/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IRegisterCustomer {
  lname: string;
  fname: string;
  state: string;
  city: string;
  phone: string;
  address: string;
  password: string;
  email: string;
  role: "customer" | "artisan";
}

export interface IRegisterArtisanPayload {
  fname: string;
  lname: string;
  state: string;
  city: string;
  phone: string;
  address: string;
  email: string;
  skills: string;
  role: "customer" | "artisan";
  meansOfId: File | null;
  profilePicture: File | null;
  images: File[] | null;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
  }),
  endpoints: (builder) => ({
    registerAsUser: builder.mutation<
      {
        token: string;
        data: {
          user: {
            id: string;
          };
        };
      },
      IRegisterCustomer
    >({
      query: (body) => ({
        url: "/api/auth/register",
        body,
        method: "POST",
      }),
    }),
    loginAsUser: builder.mutation<
      {
        token: string;
        data: {
          user: {
            id: string;
          };
        };
      },
      ILoginPayload
    >({
      query: (body) => ({
        url: "/api/auth/login",
        body,
        method: "POST",
      }),
    }),
    loginAsAdmin: builder.mutation<
      {
        token: string;
      },
      ILoginPayload
    >({
      query: (body) => ({
        url: "/api/auth/admin/login",
        method: "POST",
        body,
      }),
    }),
    registerArtisans: builder.mutation<unknown, IRegisterArtisanPayload>({
      query: (payload) => {
        const data = new FormData();

        // Append text fields
        Object.entries(payload).forEach(([key, value]) => {
          if (
            key !== "images" &&
            key !== "profilePicture" &&
            key !== "meansOfId" &&
            key !== "skills"
          ) {
            data.append(key, value as string);
          }
        });

        // Append single files
        if (payload.profilePicture)
          data.append("profilePicture", payload.profilePicture);
        if (payload.skills) {
          data.append("skills", payload.skills);
        }
        if (payload.meansOfId) data.append("meansOfId", payload.meansOfId);

        // Append multiple images
        if (payload.images && payload.images.length > 0) {
          payload.images.forEach((image) => data.append("images", image));
        }
        return {
          url: "/api/auth/register",
          method: "POST",
          body: data,
        };
      },
    }),
    setArtisanPassword: builder.mutation<
      unknown,
      { password: string; token: string }
    >({
      query: ({ password, token }) => ({
        method: "POST",
        url: `/api/users/set-artisan-password/${token}`,
        body: {
          password,
        },
      }),
    }),
  }),
});

export const {
  useRegisterAsUserMutation,
  useLoginAsUserMutation,
  useRegisterArtisansMutation,
  useLoginAsAdminMutation,
  useSetArtisanPasswordMutation,
} = authApi;
