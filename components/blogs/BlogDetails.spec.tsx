import { render, screen } from '@testing-library/react';
import BlogDetails from './BlogDetails';

const blog = {
  _id: 'b1',
  title: 'Readable tests',
  content: '<p>Content with tags</p>',
  author: { _id: 'u1', username: 'author1', email: 'author@example.com' },
  authorName: 'Author fallback',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-02T00:00:00.000Z',
  lastModified: '2025-01-02T00:00:00.000Z',
};

let mockState = {
  blog: {
    selectedBlog: null as typeof blog | null,
    loading: false,
    error: null as string | null,
  },
  auth: {
    user: null as { id: string; role: string } | null,
    checkAuth: true,
  },
};
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (state: any) => any) => selector(mockState),
}));

describe('BlogDetails component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState = {
      blog: { selectedBlog: null, loading: false, error: null },
      auth: { user: null, checkAuth: true },
    };
  });

  it('renders blog not found state when blog is missing', () => {
    render(<BlogDetails blogId="123" />);
    expect(screen.getByText(/blog not found/i)).toBeInTheDocument();
  });

  it('renders loading and dispatches auth check when needed', () => {
    mockState.blog.loading = true;
    mockState.auth.checkAuth = false;

    render(<BlogDetails blogId="123" />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('renders API errors', () => {
    mockState.blog.error = 'Blog failed';

    render(<BlogDetails blogId="123" />);

    expect(screen.getByRole('alert')).toHaveTextContent('Blog failed');
  });

  it('renders blog details and edit link for the author', () => {
    mockState.blog.selectedBlog = blog;
    mockState.auth.user = { id: 'u1', role: 'user' };

    render(<BlogDetails blogId="b1" />);

    expect(screen.getByRole('heading', { name: /readable tests/i })).toBeInTheDocument();
    expect(screen.getByText(/content with tags/i)).toBeInTheDocument();
    expect(screen.getByText(/by author1/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute('href', '/blog/b1/edit');
  });

  it('uses fallback author text and hides edit for visitors', () => {
    mockState.blog.selectedBlog = { ...blog, author: undefined, authorName: '' };

    render(<BlogDetails blogId="b1" />);

    expect(screen.getByText(/by unknown/i)).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /edit/i })).not.toBeInTheDocument();
  });

  it('renders the edit link for admins', () => {
    mockState.blog.selectedBlog = { ...blog, author: { ...blog.author, _id: 'other' } };
    mockState.auth.user = { id: 'admin', role: 'admin' };

    render(<BlogDetails blogId="b1" />);

    expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute('href', '/blog/b1/edit');
  });
});
