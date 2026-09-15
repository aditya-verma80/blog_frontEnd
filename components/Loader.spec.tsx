import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import LoaderButton from './LoaderButton';

describe('loader components', () => {
  it('renders the full-page loader', () => {
    render(<Loader />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(document.querySelector('#loading-overlay')).toBeInTheDocument();
  });

  it('renders a button loader with custom text', () => {
    render(<LoaderButton textval="Saving..." />);

    expect(screen.getByText(/saving/i)).toBeInTheDocument();
  });
});
