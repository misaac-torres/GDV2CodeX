import { IconButton, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface Props {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
}

const StarRating = ({ value, max = 5, onChange }: Props) => {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <Stack direction="row" spacing={0.5} role="group" aria-label="Rating">
      {stars.map((star) => (
        <IconButton
          key={star}
          color="primary"
          size="small"
          aria-label={`Rate ${star}`}
          onClick={() => onChange?.(star)}
          data-testid={`star-${star}`}
        >
          {star <= value ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      ))}
    </Stack>
  );
};

export default StarRating;
