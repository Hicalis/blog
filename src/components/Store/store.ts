import { configureStore } from "@reduxjs/toolkit";
import ArticleReducer from "./ArticleSlice";
import AccountReducer from "./AccountSlice";

const store = configureStore({
  reducer: {
    articles: ArticleReducer,
    account: AccountReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
