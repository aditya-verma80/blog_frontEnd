import reducer, {  registerUser, loginUser, logoutUser } from './authSlice';

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
        user: {
          id: '1',
          username: 'demo',
          email: 'demo@example.com',
          role: 'user',
          age: 24,
          address: 'Bangalore',
        },
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
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        user: {
          id: '1',
          username: 'demo',
          email: 'demo@example.com',
          role: 'user',
          age: 24,
          address: 'Bangalore',
        },
        message: 'Account created successfully',
      }),
    }) as any;

    const result = await registerUser({
      username: 'demo',
      email: 'demo@example.com',
      password: '123456',
      confirmPassword: '123456',
      age: 24,
      address: 'Bangalore',
    })(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(registerUser.fulfilled.type);
    expect(result.payload.user.username).toBe('demo');
  });

  it('registerUser rejects when API returns an error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Registration failed' }),
    }) as any;

    const result = await registerUser({
      username: 'demo',
      email: 'demo@example.com',
      password: '123456',
      confirmPassword: '123456',
      age: 24,
      address: 'Bangalore',
    })(jest.fn(), () => ({}), undefined);

    expect(result.type).toBe(registerUser.rejected.type);
    expect(result.payload).toBe('Registration failed');
  });
});
