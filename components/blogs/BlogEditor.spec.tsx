import { render, screen } from '@testing-library/react';
import BlogEditor from './BlogEditor';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
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
    render(<BlogEditor />);

    expect(screen.getByText(/bloghub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to dashboard/i })).toBeInTheDocument();
  });
});
