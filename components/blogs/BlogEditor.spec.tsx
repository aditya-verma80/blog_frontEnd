import { fireEvent, render, screen } from '@testing-library/react';
import BlogEditor from './BlogEditor';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('./BlogForm', () => ({
  __esModule: true,
  default: () => <div>Blog form mock</div>,
}));

describe('BlogEditor component', () => {
  it('renders the editor header and form', () => {
    render(<BlogEditor blogId="b1" />);

    expect(screen.getByText(/bloghub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/blog form mock/i)).toBeInTheDocument();
  });

  it('navigates back to dashboard', () => {
    render(<BlogEditor />);

    fireEvent.click(screen.getByRole('button', { name: /back to dashboard/i }));

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
