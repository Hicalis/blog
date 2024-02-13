import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getArticles = createAsyncThunk(
  "getArticles",
  async ({ page, key }: { page: number; key: string }) => {
    const offset = page * 5 - 5;
    let res: Response;
    if (key) {
      res = await fetch(
        `https://blog.kata.academy/api/articles?limit=5&offset=${offset}`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );
    } else {
      res = await fetch(
        `https://blog.kata.academy/api/articles?limit=5&offset=${offset}`
      );
    }
    const articles = await res.json();
    return articles;
  }
);

export const getArticleBySlug = createAsyncThunk(
  "getArticleBySlug",
  async ({ slug, key }: { slug: string; key: string }) => {
    let res: Response;
    if (key) {
      res = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
        method: "GET",
        headers: {
          Authorization: `Token ${key}`,
        },
      });
    } else {
      res = await fetch(`https://blog.kata.academy/api/articles/${slug}`);
    }
    const article = await res.json();
    return article.article;
  }
);

export const addLike = createAsyncThunk(
  "addLike",
  async ({ slug, key }: { slug: string; key?: string }) => {
    const res = await fetch(
      `https://blog.kata.academy/api/articles/${slug}/favorite`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${key}`,
        },
      }
    );
    const like = await res.json();
    return like;
  }
);

export const removeLike = createAsyncThunk(
  "addLike",
  async ({ slug, key }: { slug: string; key?: string }) => {
    const res = await fetch(
      `https://blog.kata.academy/api/articles/${slug}/favorite`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${key}`,
        },
      }
    );
    const like = await res.json();
    if (like.errors.error.status === 401) {
      throw new Error(like.errors.error.status);
    }
    return like;
  }
);

export const createArticle = createAsyncThunk(
  "createArticle",
  async ({
    title,
    description,
    text,
    tags,
    key,
  }: {
    title: string;
    description: string;
    text: string;
    tags: string[];
    key: string;
  }) => {
    const res = await fetch(`https://blog.kata.academy/api/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${key}`,
      },
      body: JSON.stringify({
        article: {
          title: title,
          description: description,
          body: text,
          tagList: tags,
        },
      }),
    });
    const article = await res.json();
    return article;
  }
);

export const deleteArticle = createAsyncThunk(
  "deleteArticle",
  async ({ slug, key }: { slug: string; key: string }) => {
    const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Token ${key}`,
      },
    });
    const article = await res.json();
    return article;
  }
);

export const editArticle = createAsyncThunk(
  "EditArticle",
  async ({
    title,
    description,
    text,
    tags,
    key,
    slug,
  }: {
    title: string;
    description: string;
    text: string;
    tags: string[];
    key: string;
    slug: string;
  }) => {
    const res = await fetch(`https://blog.kata.academy/api/articles/${slug}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${key}`,
      },
      body: JSON.stringify({
        article: {
          title: title,
          description: description,
          body: text,
          tagList: tags,
        },
      }),
    });
    const article = await res.json();
    return article;
  }
);

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    following: boolean;
  };
};

type ArticleState = {
  articles: Article[];
  article: Article | null;
  status: string;
  articlesCount: number;
  currentPage: number;
  errorCreate: boolean;
  errorAddLike: boolean;
};

const initialState: ArticleState = {
  articles: [],
  article: null,
  status: "",
  articlesCount: 1,
  currentPage: 1,
  errorCreate: false,
  errorAddLike: false,
};

export const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    changePage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
      localStorage.setItem("currentPage", `${action.payload}`);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getArticles.fulfilled,
        (
          state,
          action: PayloadAction<{ articles: []; articlesCount: number }>
        ) => {
          state.status = "fulfilled";
          state.articles = action.payload.articles;
          state.articlesCount = action.payload.articlesCount;
        }
      )
      .addCase(getArticles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getArticles.rejected, () => {
        getArticles({ page: 1, key: localStorage.getItem("token")! });
      })
      .addCase(getArticleBySlug.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getArticleBySlug.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.status = "fulfilled";
          state.article = action.payload;
        }
      )
      .addCase(createArticle.rejected, (state) => {
        state.errorCreate = true;
      })
      .addCase(createArticle.fulfilled, (state) => {
        state.errorCreate = false;
      });
  },
});

export default articlesSlice.reducer;
export const { changePage } = articlesSlice.actions;
