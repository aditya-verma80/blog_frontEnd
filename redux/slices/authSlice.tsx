import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASEURL } from "../api";

type AuthState = {
  user: string | null;
  token: string | null;
  loading: boolean | null;
  error: string | null;
  isAuthenticated: boolean;
  checkAuth: boolean;
};

export interface User {
  id: string;
  user: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  age: number;
  address: string;
}

// example
// const fetchUserById = createAsyncThunk(
//   "users/fetchByIdStatus",
//   async (userId: number, thunkAPI) => {
//     const response = await userAPI.fetchById(userId);
//     return response.data;
//   },
// );

const initialState: AuthState = {
  user: null,
  token: null,
  loading: null,
  error: null,
  isAuthenticated: false,
  checkAuth: false,
};

// export const baseURL = data;

// register api call
export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    signupAccess: {
      user: string;
      email: string;
      password: string;
      confirmPassword: string;
      age: number;
      address: string;
    },
    { rejectWithValue },
  ) => {
    try {
      // const response = await fetch(`${API_BASEURL}/auth/register`, {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupAccess),
      });
      console.log(response, "-----comming form authslice fetch response-----");
      const res = await response.json();
      console.log(res, "-----line no 97 authslice-------");
      const { token, user } = res;
      return { token, user };
    } catch (error) {
      const err = error as Error;
      return rejectWithValue({ message: err.message });
    }
  },
);

// register api call
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    loginAccess: {
      email: string;
      password: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginAccess),
      });
      console.log(response, "-----comming form authslice fetch response-----");

      const res = await response.json();
      console.log(res, "-----line no 97 authslice-------");
      const { token, user } = res;
      return { token, user };
    } catch (error) {
      const err = error as Error;
      return rejectWithValue({ message: err.message });
    }
  },
);

// current user detail api call
export const currentUser = createAsyncThunk(
  "auth/currentUser",
  async (me: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(me),
      });
      console.log(response, "-----comming form authslice fetch response-----");

      const res = await response.json();
      console.log(res, "-----line no 97 authslice-------");
      const { token, user } = res;
      return { token, user };
    } catch (error) {
      const err = error as Error;
      return rejectWithValue({ message: err.message });
    }
  },
);

export const authSlicer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerAuth: (state, action) => {
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
      state.checkAuth = true;
    },
    finishAuth: (state) => {
      state.checkAuth = true;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.checkAuth = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
        state.isAuthenticated = false;
        state.checkAuth = true;
      })
      //for login ==================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.checkAuth = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
        state.isAuthenticated = false;
        state.checkAuth = true;
      })
      // current user check by token

      .addCase(currentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.checkAuth = true;
        state.error = null;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.error = action.payload as string | null;
        state.loading = false;
        state.isAuthenticated = false;
        state.checkAuth = true;
      });
  },
});

export const { registerAuth, finishAuth } = authSlicer.actions;

export default authSlicer.reducer;
