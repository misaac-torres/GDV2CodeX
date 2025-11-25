import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StarRating from '../StarRating';

describe('StarRating', () => {
  it('updates value on click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<StarRating value={2} onChange={handleChange} />);
    const star = screen.getByTestId('star-4');
    await user.click(star);
    expect(handleChange).toHaveBeenCalledWith(4);
  });
});
