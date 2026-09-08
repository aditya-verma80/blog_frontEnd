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
  isAuthenticated: boolean | null;
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
  console.log(response, "getting value form ");
  const data = await response.json().catch(() => ({}));
  console.log(data, "geting response from other side");
  if (!response.ok) {
    throw new Error(data.error || data.message || "Authentication failed");
  }
  return data;
}

// for registerUser api call
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
    console.log(response, "response registration hit api call");
    const data = await readResponse(response);
    console.log(data, "data registration hit api call");
    return {
      user: data.user as User,
      message: data.message || "Account created successfully",
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Registration failed",
    );
  }
});

// for loginUser api call
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
    console.log(response, "response hit for loginusre");
    const data = await readResponse(response);
    console.log(data, "data hit for loginusre");
    return {
      user: data.user as User,
      message: data.message || "Login successful",
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Login failed",
    );
  }
});

// for currentUser api call
export const currentUser = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: string }
>("auth/currentUser", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/me", { cache: "no-store" });
    console.log(response, "response hit for login");
    const data = await readResponse(response);
    console.log(data, "data hit for logout");
    return { user: data.user, message: data.message || "User loaded" };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Unauthorized user",
    );
  }
});

// for logout api call
export const logoutUser = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await fetch("/api/logout", { method: "POST" });
    console.log(response, "response hit for logout");
    const data = await readResponse(response);
    console.log(data, "logout hit");
    return data.message || "Logged out successfully";
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Logout failed",
    );
  }
});

export const authSlicer = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // register user form /api/register ==========================
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
        state.error =
          action.payload || action.error.message || "Registration fail";
        state.isAuthenticated = false;
        state.checkAuth = true;
      })
      // login  user form /auth/login ==========================
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
        state.error = action.payload || action.error.message || "Login fail";
        state.isAuthenticated = false;
        state.checkAuth = true;
      })

      // current user form /auth/me  ================================
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
        state.error =
          action.payload || action.error.message || "Not authorized user";
        state.isAuthenticated = false;
        state.checkAuth = true;
      })

      // for logout user form /auth/logout =========================
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
        state.error = action.payload || action.error.message || "Logout fail";
      });
  },
});

export default authSlicer.reducer;
