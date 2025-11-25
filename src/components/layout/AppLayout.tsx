import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import Header from './Header';
import NavigationTabs from './NavigationTabs';

const Main = styled('main')(({ theme }) => ({
  marginTop: theme.spacing(10),
  paddingBottom: theme.spacing(6)
}));

interface Props {
  children: ReactNode;
}

const AppLayout = ({ children }: Props) => (
  <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
    <Header />
    <Container maxWidth="lg">
      <NavigationTabs />
      <Main>{children}</Main>
    </Container>
  </Box>
);

export default AppLayout;
