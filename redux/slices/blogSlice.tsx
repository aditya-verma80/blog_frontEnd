import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Blog } from "@/types/blog";

type BlogResponse = { blog: Blog; message: string };
type BlogsResponse = { blogs: Blog[]; message: string };
type BlogInput = { title: string; content: string };
type DeleteBlogResponse = { id: string; message: string };

type BlogState = {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
  message: string | null;
};

const initialState: BlogState = {
  blogs: [],
  selectedBlog: null,
  loading: false,
  error: null,
  message: null,
};

async function readResponse(response: Response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(data.error || data.message || "Blog request failed");
  return data;
}

export const fetchBlogs = createAsyncThunk<
  BlogsResponse,
  void,
  { rejectValue: string }
>("blog/fetchBlogs", async (_, { rejectWithValue }) => {
  try {
    const data = await readResponse(
      await fetch("/api/blog", { cache: "no-store" }),
    );
    console.log(data, "fetchBlogs from slice side");
    return {
      blogs: data.data as Blog[],
      message: data.message || "Blogs fetched successfully",
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch blogs",
    );
  }
});

export const fetchBlogById = createAsyncThunk<
  BlogResponse,
  string,
  { rejectValue: string }
>("blog/fetchBlogById", async (id, { rejectWithValue }) => {
  try {
    const data = await readResponse(
      await fetch(`/api/blog/${encodeURIComponent(id)}`, { cache: "no-store" }),
    );
    console.log(data, "from redex blog==fetchBlogById  page side");
    return {
      blog: data.data as Blog,
      message: data.message || "Blog fetched successfully",
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to fetch blog",
    );
  }
});

export const createBlog = createAsyncThunk<
  BlogResponse,
  BlogInput,
  { rejectValue: string }
>("blog/createBlog", async (input, { rejectWithValue }) => {
  try {
    const data = await readResponse(
      await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    );
    console.log(data, "form createBlog redux blogslice api call");
    return {
      blog: data.data as Blog,
      message: data.message || "Blog created successfully",
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create blog",
    );
  }
});

export const updateBlog = createAsyncThunk<
  BlogResponse,
  { id: string; data: BlogInput },
  { rejectValue: string }
>("blog/updateBlog", async ({ id, data: input }, { rejectWithValue }) => {
  try {
    const data = await readResponse(
      await fetch(`/api/blog/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    );
    console.log(data, "comming from updateBlog side slice ");
    return {
      blog: data.data as Blog,
      message: data.message || "Blog updated successfully",
    };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update blog",
    );
  }
});

export const deleteBlog = createAsyncThunk<
  DeleteBlogResponse,
  string,
  { rejectValue: string }
>("blog/deleteBlog", async (id, { rejectWithValue }) => {
  try {
    const data = await readResponse(
      await fetch(`/api/blog/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }),
    );
    return { id, message: data.message || "Blog deleted successfully" };
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to delete blog",
    );
  }
});

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
    clearBlogError: (state) => {
      state.error = null;
    },
    clearBlogMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, startRequest)
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.blogs;
        state.message = action.payload.message;
      })
      .addCase(fetchBlogs.rejected, failRequest)
      .addCase(fetchBlogById.pending, startRequest)
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload.blog;
        state.message = action.payload.message;
      })
      .addCase(fetchBlogById.rejected, failRequest)
      .addCase(createBlog.pending, startRequest)
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs.unshift(action.payload.blog);
        state.selectedBlog = action.payload.blog;
        state.message = action.payload.message;
      })
      .addCase(createBlog.rejected, failRequest)
      .addCase(updateBlog.pending, startRequest)
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBlog = action.payload.blog;
        const index = state.blogs.findIndex(
          (blog) => blog._id === action.payload.blog._id,
        );
        if (index !== -1) state.blogs[index] = action.payload.blog;
        state.message = action.payload.message;
      })
      .addCase(updateBlog.rejected, failRequest);
    builder
      .addCase(deleteBlog.pending, startRequest)
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter(
          (blog) => blog._id !== action.payload.id,
        );
        if (state.selectedBlog?._id === action.payload.id)
          state.selectedBlog = null;
        state.message = action.payload.message;
      })
      .addCase(deleteBlog.rejected, failRequest);
  },
});

function startRequest(state: BlogState) {
  state.loading = true;
  state.error = null;
  state.message = null;
}

function failRequest(
  state: BlogState,
  action: { payload?: string; error: { message?: string } },
) {
  state.loading = false;
  state.error = action.payload || action.error.message || "Blog request failed";
}

export const { clearSelectedBlog, clearBlogError, clearBlogMessage } =
  blogSlice.actions;
export default blogSlice.reducer;
