import reducer, { currentUser, loginUser, logoutUser, registerUser } from './authSlice';

const user = {
  id: '1',
  username: 'demo',
  email: 'demo@example.com',
  role: 'user' as const,
  age: 24,
  address: 'Bangalore',
};

const authenticatedState = {
  user,
  loading: false,
  error: null,
  isAuthenticated: true,
  checkAuth: true,
};

describe('authSlice reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      checkAuth: false,
    });
  });

  it('handles registerUser pending and fulfilled', () => {
    const pendingState = reducer(undefined, { type: registerUser.pending.type });
    expect(pendingState.loading).toBe(true);
    expect(pendingState.error).toBeNull();

    const fulfilledState = reducer(pendingState, {
      type: registerUser.fulfilled.type,
      payload: {
        user,
        message: 'Account created successfully',
      },
    });

    expect(fulfilledState.loading).toBe(false);
    expect(fulfilledState.user?.email).toBe('demo@example.com');
    expect(fulfilledState.isAuthenticated).toBe(true);
    expect(fulfilledState.checkAuth).toBe(true);
  });

  it('handles registerUser rejected', () => {
    const rejectedState = reducer(undefined, {
      type: registerUser.rejected.type,
      payload: 'Registration failed',
    });

    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.error).toBe('Registration failed');
    expect(rejectedState.isAuthenticated).toBe(false);
  });

  it('handles registerUser rejected fallback error', () => {
    const state = reducer(undefined, {
      type: registerUser.rejected.type,
      error: {},
    });

    expect(state.error).toBe('Registration fail');
    expect(state.checkAuth).toBe(true);
  });

  it('handles loginUser pending and rejected fallback error', () => {
    const pendingState = reducer(undefined, { type: loginUser.pending.type });
    expect(pendingState.loading).toBe(true);
    expect(pendingState.error).toBeNull();

    const rejectedState = reducer(pendingState, {
      type: loginUser.rejected.type,
      error: {},
    });

    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.error).toBe('Login fail');
    expect(rejectedState.isAuthenticated).toBe(false);
    expect(rejectedState.checkAuth).toBe(true);
  });

  it('handles loginUser fulfilled', () => {
    const state = reducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: {
        user: {
          id: '2',
          username: 'login-user',
          email: 'login@example.com',
          role: 'user',
          age: 28,
          address: 'Pune',
        },
        message: 'Login successful',
      },
    });

    expect(state.isAuthenticated).toBe(true);
    expect(state.user?.username).toBe('login-user');
  });

  it('handles logoutUser fulfilled', () => {
    const state = reducer({
      user: {
        id: '3',
        username: 'logout-user',
        email: 'logout@example.com',
        role: 'user',
        age: 35,
        address: 'Hyderabad',
      },
      loading: false,
      error: null,
      isAuthenticated: true,
      checkAuth: false,
    }, { type: logoutUser.fulfilled.type, payload: 'Logged out successfully' });

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.checkAuth).toBe(true);
  });

  it('handles currentUser pending, fulfilled, and rejected', () => {
    const pendingState = reducer(undefined, { type: currentUser.pending.type });
    expect(pendingState.loading).toBe(true);

    const fulfilledState = reducer(pendingState, {
      type: currentUser.fulfilled.type,
      payload: { user, message: 'User loaded' },
    });
    expect(fulfilledState.user).toEqual(user);
    expect(fulfilledState.isAuthenticated).toBe(true);

    const rejectedState = reducer(authenticatedState, {
      type: currentUser.rejected.type,
      payload: 'Unauthorized',
    });
    expect(rejectedState.user).toBeNull();
    expect(rejectedState.error).toBe('Unauthorized');
    expect(rejectedState.isAuthenticated).toBe(false);
    expect(rejectedState.checkAuth).toBe(true);
  });

  it('handles logoutUser pending and rejected fallback error', () => {
    const pendingState = reducer(authenticatedState, { type: logoutUser.pending.type });
    expect(pendingState.loading).toBe(true);
    expect(pendingState.error).toBeNull();

    const rejectedState = reducer(pendingState, {
      type: logoutUser.rejected.type,
      error: {},
    });

    expect(rejectedState.loading).toBe(false);
    expect(rejectedState.error).toBe('Logout fail');
  });
});

describe('auth async thunks', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it('registerUser resolves with user data when API succeeds', async () => {
    const mockResponse: Response = {
      ok: true,
      json: async () => ({
        user,
        message: 'Account created successfully',
      }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await registerUser({
      username: 'demo',
      email: 'demo@example.com',
      password: '123456',
      confirmPassword: '123456',
      age: 24,
      address: 'Bangalore',
    })(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(registerUser.fulfilled.type);
    if (result.type !== registerUser.fulfilled.type) {
      throw new Error('Expected registerUser fulfilled action');
    }
    expect(result.payload.user.username).toBe('demo');
  });

  it('registerUser resolves with the default success message', async () => {
    const mockResponse: Response = {
      ok: true,
      json: async () => ({ user }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await registerUser({
      username: 'demo',
      email: 'demo@example.com',
      password: '123456',
      confirmPassword: '123456',
      age: 24,
      address: 'Bangalore',
    })(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(registerUser.fulfilled.type);
    if (result.type !== registerUser.fulfilled.type) {
      throw new Error('Expected registerUser fulfilled action');
    }
    expect(result.payload.message).toBe('Account created successfully');
  });

  it('loginUser resolves with a default message when API omits one', async () => {
    const mockResponse: Response = {
      ok: true,
      json: async () => ({ user }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await loginUser({
      email: 'demo@example.com',
      password: '123456',
    })(jest.fn(), () => ({}), undefined);

    expect(global.fetch).toHaveBeenCalledWith('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@example.com', password: '123456' }),
    });
    expect(result.type).toBe(loginUser.fulfilled.type);
    if (result.type !== loginUser.fulfilled.type) {
      throw new Error('Expected loginUser fulfilled action');
    }
    expect(result.payload.message).toBe('Login successful');
  });

  it('currentUser rejects with fallback text when fetch throws a non-error', async () => {
    global.fetch = jest.fn().mockRejectedValue('offline');

    const result = await currentUser()(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(currentUser.rejected.type);
    if (result.type !== currentUser.rejected.type) {
      throw new Error('Expected currentUser rejected action');
    }
    expect(result.payload).toBe('Unauthorized user');
  });

  it('currentUser resolves with the default loaded message', async () => {
    const mockResponse: Response = {
      ok: true,
      json: async () => ({ user }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await currentUser()(jest.fn(), () => ({}), undefined);

    expect(global.fetch).toHaveBeenCalledWith('/api/me', { cache: 'no-store' });
    expect(result.type).toBe(currentUser.fulfilled.type);
    if (result.type !== currentUser.fulfilled.type) {
      throw new Error('Expected currentUser fulfilled action');
    }
    expect(result.payload.message).toBe('User loaded');
  });

  it('logoutUser resolves with fallback success message', async () => {
    const mockResponse: Response = {
      ok: true,
      json: async () => ({}),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await logoutUser()(jest.fn(), () => ({}), undefined);

    expect(global.fetch).toHaveBeenCalledWith('/api/logout', { method: 'POST' });
    expect(result.type).toBe(logoutUser.fulfilled.type);
    if (result.type !== logoutUser.fulfilled.type) {
      throw new Error('Expected logoutUser fulfilled action');
    }
    expect(result.payload).toBe('Logged out successfully');
  });

  it('logoutUser rejects with API error text', async () => {
    const mockResponse: Response = {
      ok: false,
      json: async () => ({ error: 'Logout blocked' }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await logoutUser()(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(logoutUser.rejected.type);
    if (result.type !== logoutUser.rejected.type) {
      throw new Error('Expected logoutUser rejected action');
    }
    expect(result.payload).toBe('Logout blocked');
  });

  it('loginUser rejects with fallback text when fetch throws a non-error', async () => {
    global.fetch = jest.fn().mockRejectedValue('offline');

    const result = await loginUser({
      email: 'demo@example.com',
      password: '123456',
    })(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(loginUser.rejected.type);
    if (result.type !== loginUser.rejected.type) {
      throw new Error('Expected loginUser rejected action');
    }
    expect(result.payload).toBe('Login failed');
  });

  it('logoutUser rejects with fallback text when fetch throws a non-error', async () => {
    global.fetch = jest.fn().mockRejectedValue('offline');

    const result = await logoutUser()(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(logoutUser.rejected.type);
    if (result.type !== logoutUser.rejected.type) {
      throw new Error('Expected logoutUser rejected action');
    }
    expect(result.payload).toBe('Logout failed');
  });

  it('registerUser rejects when API returns an error', async () => {
    const mockResponse: Response = {
      ok: false,
      json: async () => ({ message: 'Registration failed' }),
    } as Response;

    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    const result = await registerUser({
      username: 'testuser',
      email: 'testuser@gmail.com',
      password: '123456',
      confirmPassword: '123456',
      age: 24,
      address: 'Bangalore',
    })(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(registerUser.rejected.type);
    if (result.type !== registerUser.rejected.type) {
      throw new Error('Expected registerUser rejected action');
    }
    expect(result.payload ?? '').toBe('Registration failed');
  });
});
