import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  age: number;
  address: string;
}

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  checkAuth: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  checkAuth: false,
};

async function readResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Authentication failed");
  }
  return data;
}

export const registerUser = createAsyncThunk<
  User,
  { user: Omit<User, "id" | "createdAt" | "updatedAt"> },
  { rejectValue: string }
>("auth/register", async (signupAccess, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupAccess),
    });
    const data = await readResponse(response);
    return data.user as User;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Registration failed",
    );
  }
});

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (loginAccess, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginAccess),
    });
    const data = await readResponse(response);
    return data.user as User;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Login failed",
    );
  }
});

export const currentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/currentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/me", { cache: "no-store" });
    const data = await readResponse(response);
    return data.user as User;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unauthorized user",
    );
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      await readResponse(response);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Logout failed",
      );
    }
  },
);

export const authSlicer = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.checkAuth = true;
      })
      .addMatcher(
        (action) =>
          [
            registerUser.pending.type,
            loginUser.pending.type,
            currentUser.pending.type,
            logoutUser.pending.type,
          ].includes(action.type),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          [
            registerUser.fulfilled.type,
            loginUser.fulfilled.type,
            currentUser.fulfilled.type,
          ].includes(action.type),
        (state, action: { payload: User }) => {
          state.loading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          state.checkAuth = true;
        },
      )
      .addMatcher(
        (action) =>
          [
            registerUser.rejected.type,
            loginUser.rejected.type,
            currentUser.rejected.type,
            logoutUser.rejected.type,
          ].includes(action.type),
        (state, action: { payload?: string; error?: { message?: string } }) => {
          state.loading = false;
          state.error =
            action.payload || action.error?.message || "Authentication failed";
          state.isAuthenticated = false;
          state.checkAuth = true;
        },
      );
  },
});

export default authSlicer.reducer;
