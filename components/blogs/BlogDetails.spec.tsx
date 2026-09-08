import { render, screen } from '@testing-library/react';
import BlogDetails from './BlogDetails';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => ({
    selectedBlog: null,
    loading: false,
    error: null,
    user: null,
    checkAuth: true,
  }),
}));

describe('BlogDetails component', () => {
  it('renders blog not found state when blog is missing', () => {
    render(<BlogDetails blogId="123" />);
    expect(screen.getByText(/blog not found/i)).toBeInTheDocument();
  });
});
