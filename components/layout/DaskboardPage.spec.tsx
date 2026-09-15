import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DaskboardPage from './DaskboardPage';
import exportPdf from '@/components/tools/Pdf';
import exportDocument from '@/components/tools/WordDocs';
import { toast } from 'react-toastify';

jest.mock('@/components/Navbar', () => () => <div>Navbar</div>);
jest.mock('@/components/ConfirmationModal', () => ({
  __esModule: true,
  default: ({
    isOpen,
    onClose,
    onConfirm,
    itemName,
  }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
  }) =>
    isOpen ? (
      <div role="dialog">
        <p>Delete {itemName}?</p>
        <button type="button" onClick={onConfirm}>
          Confirm delete
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    ) : null,
}));
jest.mock('@/components/tools/Pdf', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('@/components/tools/WordDocs', () => ({ __esModule: true, default: jest.fn() }));

const blog = {
  _id: 'b1',
  title: 'Testing tips',
  content: '<p>Write useful tests</p>',
  author: { _id: 'u1', username: 'aditya', email: 'a@example.com' },
  authorName: 'fallback author',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  lastModified: '2025-01-02T00:00:00.000Z',
};

let mockState = {
  blog: { blogs: [] as typeof blog[], loading: false, error: null as string | null },
  auth: { user: { id: 'u1', role: 'user' } },
};
let mockDispatch = jest.fn(() => ({ unwrap: jest.fn() }));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) =>
    selector(mockState),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DaskboardPage component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch = jest.fn(() => ({ unwrap: jest.fn() }));
    mockState = {
      blog: { blogs: [], loading: false, error: null },
      auth: { user: { id: 'u1', role: 'user' } },
    };
  });

  it('renders dashboard section title', () => {
    render(<DaskboardPage />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('renders loading, error, and empty states', () => {
    mockState.blog = { blogs: [], loading: true, error: null };
    const { rerender } = render(<DaskboardPage />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading blogs/i);

    mockState.blog = { blogs: [], loading: false, error: 'Unable to load' };
    rerender(<DaskboardPage />);
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load');

    mockState.blog = { blogs: [], loading: false, error: null };
    rerender(<DaskboardPage />);
    expect(screen.getByText(/no blogs found/i)).toBeInTheDocument();
  });

  it('renders blog cards and owner actions', () => {
    mockState.blog = { blogs: [blog], loading: false, error: null };

    render(<DaskboardPage />);

    expect(screen.getByRole('heading', { name: blog.title })).toBeInTheDocument();
    expect(screen.getByText(/write useful tests/i)).toBeInTheDocument();
    expect(screen.getByText(/aditya/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /read more/i })).toHaveAttribute('href', '/blog/b1');
    expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute('href', '/blog/b1/edit');
  });

  it('renders admin actions and export buttons', () => {
    mockState = {
      blog: { blogs: [{ ...blog, author: { ...blog.author, _id: 'other' } }], loading: false, error: null },
      auth: { user: { id: 'admin', role: 'admin' } },
    };

    render(<DaskboardPage />);

    fireEvent.click(screen.getByRole('button', { name: /download testing tips as a word document/i }));
    fireEvent.click(screen.getByRole('button', { name: /print or save testing tips as pdf/i }));

    expect(exportDocument).toHaveBeenCalledWith(mockState.blog.blogs[0]);
    expect(exportPdf).toHaveBeenCalledWith(mockState.blog.blogs[0]);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('does not show owner-only actions to other users', () => {
    mockState = {
      blog: { blogs: [blog], loading: false, error: null },
      auth: { user: { id: 'u2', role: 'user' } },
    };

    render(<DaskboardPage />);

    expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('does not show owner-only actions when no user or author exists', () => {
    mockState = {
      blog: { blogs: [{ ...blog, author: undefined as any }], loading: false, error: null },
      auth: { user: null as any },
    };

    render(<DaskboardPage />);

    expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('confirms a successful delete', async () => {
    const unwrap = jest.fn().mockResolvedValue({ message: 'Deleted' });
    mockDispatch = jest.fn(() => ({ unwrap }));
    mockState.blog = { blogs: [blog], loading: false, error: null };

    render(<DaskboardPage />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Delete Testing tips?');

    fireEvent.click(screen.getByRole('button', { name: /confirm delete/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Deleted'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows a delete error and allows canceling the modal', async () => {
    const unwrap = jest.fn().mockRejectedValue('Cannot delete');
    mockDispatch = jest.fn(() => ({ unwrap }));
    mockState.blog = { blogs: [blog], loading: false, error: null };

    render(<DaskboardPage />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm delete/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Cannot delete'));

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows a fallback delete error for non-string failures', async () => {
    const unwrap = jest.fn().mockRejectedValue(new Error('Cannot delete'));
    mockDispatch = jest.fn(() => ({ unwrap }));
    mockState.blog = { blogs: [blog], loading: false, error: null };

    render(<DaskboardPage />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm delete/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Unable to delete blog'));
  });
});
