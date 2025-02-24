import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { authApi } from "./features/auth/auth";
import { userApi } from "./features/admin/users";
import { serviceApi } from "./features/services";
import { bookingApi } from "./features/booking";
import { artisanBookingApi } from "./features/pro/booking";

const persistConfig = {
  key: "root",
  storage,
};

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [artisanBookingApi.reducerPath]: artisanBookingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      authApi.middleware,
      userApi.middleware,
      serviceApi.middleware,
      bookingApi.middleware,
      artisanBookingApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
