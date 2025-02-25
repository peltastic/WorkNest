import config from "@/config/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IGetFetchServicesResponse {
  currentPage: number;
  totalPages: number;
  totalArtisans: number;
  artisans: {
    _id: string;
    user: {
      _id: string;
      fname: string;
      lname: string;
    };
    skills: string;
    profilePicture: string;
    rating: number
    feedbacks: {
      _id: string
      customer_name: string
      feedback: string
    }[]
  }[];
}

export interface IGetSingleSingleService {
  artisan: {
    _id: string;
    user: {
      _id: string;
      fname: string;
      lname: string;
      email: string;
      phone: string;
      city: string;
      state: string;
    };
    skills: string;
    images: string[];
    profilePicture: string;
    rating: number
    feedbacks: {
      _id: string
      customer_name: string
      feedback: string
    }[]
  };
}

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.API_URL,
  }),
  endpoints: (builder) => ({
    fetchServices: builder.query<IGetFetchServicesResponse, {
      limit: number
      skills?: string
      rating?: string
      location?: string
    }>({
      query: ({limit, location,rating, skills}) => {
        let query = ""
        if (limit) {
          query += `?limit=${limit}`
        }
        if (location) {
          query += `&city=${location}`
        }
        if (rating) {
          query += `&rating=${rating}`
        }
        if (skills) {
          query += `&skills=${skills}`
        }
        return {
          url: `/api/services/getServices${query}`,
        };
      },
    }),
    getSingleService: builder.query<IGetSingleSingleService, string>({
        query: (id) => ({
            url: `/api/services/get-services/${id}`
        })
    }),
  }),
});

export const { useFetchServicesQuery, useLazyFetchServicesQuery, useLazyGetSingleServiceQuery } = serviceApi;
