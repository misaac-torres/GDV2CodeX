import { Box, Stack, Typography } from '@mui/material';
import { COLORS } from '../../theme';

interface Props {
  total_dep: number;
  total_L: number;
  total_P: number;
}

const getActiveColor = ({ total_dep, total_L, total_P }: Props) => {
  if (total_dep === 0) return 'gray';
  if (total_P === 0 && total_L > 0) return 'green';
  if (total_L === 0 && total_P > 0) return 'red';
  return 'yellow';
};

const colorMap: Record<string, string> = {
  gray: '#9ca3af',
  red: '#ef4444',
  yellow: '#f59e0b',
  green: '#22c55e'
};

const TrafficLight = (props: Props) => {
  const active = getActiveColor(props);

  return (
    <Stack direction="row" spacing={1} alignItems="center" data-testid="traffic-light">
      {(['red', 'yellow', 'green'] as const).map((color) => (
        <Box
          key={color}
          sx={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            border: `2px solid ${COLORS.DARK}`,
            backgroundColor: active === color ? colorMap[color] : 'transparent',
            transition: 'background-color 0.2s ease'
          }}
        />
      ))}
      <Typography variant="body2" color="text.secondary">
        deps: {props.total_dep} (L {props.total_L} / P {props.total_P})
      </Typography>
    </Stack>
  );
};

export { getActiveColor };
export default TrafficLight;
