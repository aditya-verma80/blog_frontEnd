import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import BlogForm from './BlogForm';
import { toast } from 'react-toastify';

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockDispatch = jest.fn();
let mockBlogState = { loading: false };
const mockQuillInstances: Array<{
  root: { innerHTML: string; setAttribute: jest.Mock };
  handler?: () => void;
}> = [];

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockBlogState,
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('quill', () => ({
  __esModule: true,
  default: class MockQuill {
    root: { innerHTML: string; setAttribute: (name: string, value: string) => void };

    constructor(element: HTMLElement) {
      this.root = {
        innerHTML: '',
        setAttribute: jest.fn(),
      };
      mockQuillInstances.push(this);
      element.innerHTML = '';
    }

    on = jest.fn((_event: string, handler: () => void) => {
      this.handler = handler;
    });
    getSelection = jest.fn(() => null);
    setSelection = jest.fn();
  },
}));

describe('BlogForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBlogState = { loading: false };
    mockQuillInstances.length = 0;
    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        blog: { _id: 'saved-blog', title: 'Saved', content: '<p>Body</p>' },
        message: 'Saved successfully',
      }),
    });
  });

  it('renders create form title and submit button', () => {
    render(<BlogForm />);

    expect(screen.getByRole('heading', { name: /create new blog/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add blog/i })).toBeInTheDocument();
  });

  it('shows validation errors for blank fields', async () => {
    render(<BlogForm />);

    fireEvent.click(screen.getByRole('button', { name: /add blog/i }));

    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/content is required/i)).toBeInTheDocument();
  });

  it('renders a disabled loading submit button', () => {
    mockBlogState = { loading: true };

    render(<BlogForm />);

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('clears a title validation error when the title changes', async () => {
    render(<BlogForm />);

    fireEvent.click(screen.getByRole('button', { name: /add blog/i }));
    expect(await screen.findByText(/title is required/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/blog title/i), {
      target: { name: 'title', value: 'New title' },
    });

    expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
  });

  it('submits a valid create form and navigates to the new blog', async () => {
    render(<BlogForm />);

    fireEvent.change(screen.getByLabelText(/blog title/i), {
      target: { name: 'title', value: 'New blog' },
    });

    await waitFor(() => expect(mockQuillInstances[0]).toBeDefined());
    act(() => {
      mockQuillInstances[0].root.innerHTML = '<p>Created body</p>';
      mockQuillInstances[0].handler?.();
    });

    fireEvent.click(screen.getByRole('button', { name: /add blog/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Saved successfully'));
    expect(mockPush).toHaveBeenCalledWith('/blog/saved-blog');
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('loads an existing blog before editing', async () => {
    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({
        blog: { _id: 'b1', title: 'Existing title', content: '<p>Existing</p>' },
        message: 'Loaded',
      }),
    });

    render(<BlogForm blogId="b1" />);

    expect(screen.getByRole('heading', { name: /edit blog/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update blog/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText(/blog title/i)).toHaveValue('Existing title'));
  });

  it('shows a toast when loading an existing blog fails', async () => {
    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue('Unable to load'),
    });

    render(<BlogForm blogId="missing" />);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Unable to load'));
  });

  it('shows a fallback toast when saving fails', async () => {
    mockDispatch.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue(new Error('Boom')),
    });

    render(<BlogForm />);

    fireEvent.change(screen.getByLabelText(/blog title/i), {
      target: { name: 'title', value: 'New blog' },
    });
    await waitFor(() => expect(mockQuillInstances[0]).toBeDefined());
    act(() => {
      mockQuillInstances[0].root.innerHTML = '<p>Created body</p>';
      mockQuillInstances[0].handler?.();
    });

    fireEvent.click(screen.getByRole('button', { name: /add blog/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Unable to save blog'));
  });
});
