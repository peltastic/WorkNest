import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { authApi } from "./features/auth/auth";
import { userApi } from "./features/admin/users";
import { serviceApi } from "./features/services";
import { bookingApi } from "./features/booking";
import { artisanBookingApi } from "./features/pro/booking";
import { chatApi } from "./features/chat";
import { proChatApi } from "./features/pro/chat";

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
    [chatApi.reducerPath]: chatApi.reducer,
    [proChatApi.reducerPath]: proChatApi.reducer
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
      chatApi.middleware,
      proChatApi.middleware
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
