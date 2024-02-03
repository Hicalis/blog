import { configureStore } from '@reduxjs/toolkit'
import ArticleReducer from './ArticleSlice'

const store = configureStore({
  reducer: {
    articles: ArticleReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch