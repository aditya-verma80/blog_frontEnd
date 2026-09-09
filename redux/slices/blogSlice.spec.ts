import blogReducer, {
  fetchBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  clearSelectedBlog,
  clearBlogError,
  clearBlogMessage,
} from './blogSlice';

const blogOne = {
  _id: '1',
  title: 'First blog',
  content: '<p>Hello world</p>',
  author: {
    _id: 'a1',
    username: 'author1',
    email: 'author1@example.com',
  },
  authorName: 'author1',
  lastModified: '2025-01-01',
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
};

const blogTwo = {
  _id: '2',
  title: 'Second blog',
  content: '<p>Another post</p>',
  author: {
    _id: 'a2',
    username: 'author2',
    email: 'author2@example.com',
  },
  authorName: 'author2',
  lastModified: '2025-01-02',
  createdAt: '2025-01-02',
  updatedAt: '2025-01-02',
};

describe('blogSlice reducer', () => {
  it('returns the initial state', () => {
    expect(blogReducer(undefined, { type: '@@INIT' })).toEqual({
      blogs: [],
      selectedBlog: null,
      loading: false,
      error: null,
      message: null,
    });
  });

  it('handles fetchBlogs fulfilled', () => {
    const state = blogReducer(undefined, {
      type: fetchBlogs.fulfilled.type,
      payload: {
        blogs: [blogOne, blogTwo],
        message: 'Blogs fetched successfully',
      },
    });

    expect(state.loading).toBe(false);
    expect(state.blogs).toHaveLength(2);
    expect(state.message).toBe('Blogs fetched successfully');
  });

  it('handles fetchBlogById fulfilled', () => {
    const state = blogReducer(undefined, {
      type: fetchBlogById.fulfilled.type,
      payload: {
        blog: blogOne,
        message: 'Blog fetched successfully',
      },
    });

    expect(state.selectedBlog?._id).toBe('1');
    expect(state.message).toBe('Blog fetched successfully');
  });

  it('handles createBlog fulfilled by prepending the new blog', () => {
    const state = blogReducer(
      {
        blogs: [blogTwo],
        selectedBlog: null,
        loading: false,
        error: null,
        message: null,
      },
      {
        type: createBlog.fulfilled.type,
        payload: {
          blog: blogOne,
          message: 'Blog created successfully',
        },
      },
    );

    expect(state.blogs[0]._id).toBe('1');
    expect(state.selectedBlog?._id).toBe('1');
    expect(state.message).toBe('Blog created successfully');
  });

  it('handles updateBlog fulfilled', () => {
    const updatedBlog = { ...blogOne, title: 'Updated blog' };
    const state = blogReducer(
      {
        blogs: [blogOne, blogTwo],
        selectedBlog: blogOne,
        loading: false,
        error: null,
        message: null,
      },
      {
        type: updateBlog.fulfilled.type,
        payload: {
          blog: updatedBlog,
          message: 'Blog updated successfully',
        },
      },
    );

    expect(state.selectedBlog?.title).toBe('Updated blog');
    expect(state.blogs[0].title).toBe('Updated blog');
    expect(state.message).toBe('Blog updated successfully');
  });

  it('handles deleteBlog fulfilled', () => {
    const state = blogReducer(
      {
        blogs: [blogOne, blogTwo],
        selectedBlog: blogOne,
        loading: false,
        error: null,
        message: null,
      },
      {
        type: deleteBlog.fulfilled.type,
        payload: {
          id: '1',
          message: 'Blog deleted successfully',
        },
      },
    );

    expect(state.blogs).toHaveLength(1);
    expect(state.blogs[0]._id).toBe('2');
    expect(state.selectedBlog).toBeNull();
    expect(state.message).toBe('Blog deleted successfully');
  });

  it('clears state values via reducer actions', () => {
    const state = blogReducer(
      {
        blogs: [blogOne],
        selectedBlog: blogOne,
        loading: false,
        error: 'Something went wrong',
        message: 'Saved',
      },
      clearSelectedBlog(),
    );

    expect(state.selectedBlog).toBeNull();

    const clearedErrorState = blogReducer(state, clearBlogError());
    expect(clearedErrorState.error).toBeNull();

    const clearedMessageState = blogReducer(clearedErrorState, clearBlogMessage());
    expect(clearedMessageState.message).toBeNull();
  });
});

describe('blog async thunks', () => {
  const originalFetch = global.fetch;

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('fetchBlogs resolves with blogs list when API succeeds', async () => {
    const mockResponse: Response = {
      ok: true,
      json: async () => ({
        data: [blogOne, blogTwo],
        message: 'Blogs fetched successfully',
      }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await fetchBlogs()(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(fetchBlogs.fulfilled.type);
    if (result.type !== fetchBlogs.fulfilled.type) {
      throw new Error('Expected fetchBlogs fulfilled action');
    }

    const payload = result.payload;
    expect(payload.blogs).toHaveLength(2);
    expect(payload.message).toBe('Blogs fetched successfully');
  });

  it('fetchBlogById rejects when API responds with an error', async () => {
    const mockResponse: Response = {
      ok: false,
      json: async () => ({ message: 'Blog not found' }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await fetchBlogById('missing')(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(fetchBlogById.rejected.type);
    if (result.type !== fetchBlogById.rejected.type) {
      throw new Error('Expected fetchBlogById rejected action');
    }
    expect(result.payload ?? '').toBe('Blog not found');
  });

  it('createBlog rejects when request fails', async () => {
    const mockResponse: Response = {
      ok: false,
      json: async () => ({ message: 'Failed to create blog' }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await createBlog({ title: 'Test', content: 'Body' })(
      jest.fn(),
      () => ({}),
      undefined,
    );

    expect(result.type).toBe(createBlog.rejected.type);
    if (result.type !== createBlog.rejected.type) {
      throw new Error('Expected createBlog rejected action');
    }
    expect(result.payload ?? '').toBe('Failed to create blog');
  });
});
