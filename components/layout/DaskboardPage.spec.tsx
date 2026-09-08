import { render, screen } from '@testing-library/react';
import DaskboardPage from './DaskboardPage';

jest.mock('@/components/Navbar', () => () => <div>Navbar</div>);
jest.mock('@/components/ConfirmationModal', () => () => null);
jest.mock('@/components/tools/Pdf', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('@/components/tools/WordDocs', () => ({ __esModule: true, default: jest.fn() }));

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: (selector: (state: any) => any) =>
    selector({
      blog: { blogs: [], loading: false, error: null },
      auth: { user: { id: 'u1', role: 'user' } },
    }),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DaskboardPage component', () => {
  it('renders dashboard section title', () => {
    render(<DaskboardPage />);

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
