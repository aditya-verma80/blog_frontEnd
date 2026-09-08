import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input component', () => {
  it('renders label and accepts user input', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Input
        label="Email"
        name="email"
        placeholder="Enter your email"
        value=""
        onChange={handleChange}
      />,
    );

    const input = screen.getByLabelText('Email');
    expect(input).toBeInTheDocument();

    await user.type(input, 'test@example.com');
    expect(handleChange).toHaveBeenCalled();
  });

  it('shows validation errors when provided', () => {
    render(
      <Input
        label="Password"
        name="password"
        placeholder="Enter your password"
        value=""
        onChange={jest.fn()}
        error="Password is required"
      />,
    );

    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Password is required');
  });
});
