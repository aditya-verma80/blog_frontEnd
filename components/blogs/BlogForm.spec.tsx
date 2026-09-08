import { fireEvent, render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: () => ({ loading: false }),
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
      element.innerHTML = '';
    }

    on = jest.fn();
    getSelection = jest.fn(() => null);
    setSelection = jest.fn();
  },
}));

describe('BlogForm component', () => {
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
});
