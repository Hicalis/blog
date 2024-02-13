import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "registerUser",
  async ({
    username,
    email,
    password,
  }: {
    username: string;
    email: string;
    password: string;
  }) => {
    const res = await fetch(`https://blog.kata.academy/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"user":{"username":"${username}","email":"${email}","password":"${password}"}}`,
    });
    const user = await res.json();
    return user;
  }
);

export const loginUser = createAsyncThunk(
  "loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    const res = await fetch(`https://blog.kata.academy/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"user":{"email":"${email}","password":"${password}"}}`,
    });
    const user = await res.json();
    return user;
  }
);

export const editUser = createAsyncThunk(
  "editUser",
  async ({
    username,
    email,
    password,
    url,
    key,
  }: {
    username: string;
    email: string;
    password: string;
    url: string;
    key: string;
  }) => {
    if (url.length === 0) url = `https://platform.kata.academy/images/man.png`;
    const res = await fetch(`https://blog.kata.academy/api/user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${key}`,
      },
      body: `{"user":{"email":"${email}","username":"${username}","image":"${url}","password":"${password}"}}`,
    });

    const user = await res.json();
    return user;
  }
);

type Account = {
  email: string;
  token: string;
  username: string;
  image: string;
};

type AccountState = {
  user: {
    user: Account;
  };
  error: boolean;
  errorLogin: boolean;
  errorRegister: boolean;
  errorEdit: boolean;
  result: string;
  isLogged: boolean;
};

const initialState: AccountState = {
  user: {
    user: {
      email: "",
      token: "",
      username: "",
      image: "https://static.productionready.io/images/smiley-cyrus.jpg",
    },
  },
  error: false,
  errorLogin: false,
  errorRegister: false,
  errorEdit: false,
  result: "",
  isLogged: false,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    logOut(state) {
      state.isLogged = false;
      localStorage.setItem("isLogged", "false");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state) => {
        state.result = "200";
        state.errorRegister = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.errorRegister = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.errorLogin = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorLogin = false;
        state.isLogged = true;
        if (action.payload.user.image) {
          localStorage.setItem("avatar", action.payload.user.image);
        } else {
          localStorage.setItem(
            "avatar",
            "https://platform.kata.academy/images/man.png"
          );
        }
        localStorage.setItem("token", action.payload.user.token);
        localStorage.setItem("email", action.payload.user.email);
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("username", action.payload.user.username);
      })
      .addCase(editUser.rejected, (state) => {
        state.errorEdit = true;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.errorEdit = false;
        localStorage.setItem("username", state.user.user.username);
        localStorage.setItem("email", state.user.user.email);
        localStorage.setItem("avatar", state.user.user.image);
      });
  },
});

export default accountSlice.reducer;
export const { logOut } = accountSlice.actions;
