import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  age: number;
  address: string;
}

type AuthResponse = {
  user: User;
  message: string;
};

type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: number;
  address: string;
};

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
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (signupAccess, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupAccess),
    });
    const data = await readResponse(response);
    return {
      user: data.user as User,
      message: data.message || "Account created successfully",
    };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Registration failed");
  }
});

export const loginUser = createAsyncThunk<
  AuthResponse,
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
    return {
      user: data.user as User,
      message: data.message || "Login successful",
    };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : "Login failed");
  }
});

export const currentUser = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  "auth/currentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/me", { cache: "no-store" });
      const data = await readResponse(response);
      return { user: data.user as User, message: data.message || "User loaded" };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Unauthorized user");
    }
  },
);

export const logoutUser = createAsyncThunk<string, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      const data = await readResponse(response);
      return data.message || "Logged out successfully";
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Logout failed");
    }
  },
);

export const authSlicer = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkAuth = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Registration failed";
        state.isAuthenticated = false;
        state.checkAuth = true;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Login failed";
        state.isAuthenticated = false;
        state.checkAuth = true;
      })
      .addCase(currentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(currentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.checkAuth = true;
      })
      .addCase(currentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || action.error.message || "Unauthorized user";
        state.isAuthenticated = false;
        state.checkAuth = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.checkAuth = true;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Logout failed";
      });
  },
});

export default authSlicer.reducer;
