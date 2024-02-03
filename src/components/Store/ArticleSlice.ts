import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getArticles = createAsyncThunk('getArticles', async (page:number) => {   
  const offset = page * 5 - 5 
  const res = await fetch(`https://blog.kata.academy/api/articles?limit=5&offset=${offset}`)
  const articles = await res.json()
  return articles.articles
})

export const getArticleBySlug = createAsyncThunk('getArticleBySlug',
async (slug:string) =>{
  const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`)
  const article = await res.json()
  return article.article
}
)

export type Article = {
    slug: string,
    title: string,
    description: string,
    body: string,
    tagList: string[],
    createdAt: Date,
    updatedAt: Date,
    favorited: boolean,
    favoritesCount: number,
    author: {
        username: string,
        bio: string,
        image: string,
        following: boolean
    }
}

type ArticleState = {
    articles: Article[],
    article: Article | null
    status: string
}

const initialState: ArticleState ={
    articles:[],
    article:null,
    status: ''
}

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getArticles.fulfilled, (state, action:PayloadAction<any> ) => {
        state.status = 'fulfilled'
        state.articles = action.payload
      })
      .addCase(getArticles.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getArticles.rejected, () => {
        getArticles(1)
      })
      .addCase(getArticleBySlug.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getArticleBySlug.fulfilled,(state, action:PayloadAction<any> )=>
      {
        state.status = 'fulfilled'
        state.article = action.payload
      })
  },
})

export default articlesSlice.reducer
