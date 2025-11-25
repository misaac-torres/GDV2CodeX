import { render, screen } from '@testing-library/react';
import TrafficLight, { getActiveColor } from '../TrafficLight';

describe('TrafficLight', () => {
  it('activates red when only pending', () => {
    render(<TrafficLight total_dep={2} total_L={0} total_P={2} />);
    expect(getActiveColor({ total_dep: 2, total_L: 0, total_P: 2 })).toBe('red');
    const lights = screen.getAllByTestId('traffic-light')[0].querySelectorAll('div');
    expect(lights.length).toBeGreaterThan(0);
  });

  it('activates green when only negotiated', () => {
    expect(getActiveColor({ total_dep: 1, total_L: 1, total_P: 0 })).toBe('green');
  });

  it('activates yellow when mixed', () => {
    expect(getActiveColor({ total_dep: 2, total_L: 1, total_P: 1 })).toBe('yellow');
  });
});
