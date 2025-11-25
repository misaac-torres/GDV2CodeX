import { Card, CardContent, CardHeader } from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  title: string;
  subheader?: string;
  action?: ReactNode;
  children: ReactNode;
}

const SectionCard = ({ title, subheader, action, children }: Props) => (
  <Card variant="outlined" sx={{ mb: 3 }}>
    <CardHeader title={title} subheader={subheader} action={action} />
    <CardContent>{children}</CardContent>
  </Card>
);

export default SectionCard;
