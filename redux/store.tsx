import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./slices/authSlice";
import blogReducer from "./slices/blogSlice";
export const store = configureStore({
  reducer: {
    auth: authreducer,
    blog: blogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
