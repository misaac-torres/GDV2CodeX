import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const Logo = styled('img')({
  height: 40,
  marginRight: 16
});

const Header = () => (
  <AppBar position="fixed" elevation={1}>
    <Toolbar>
      <Logo src="/assets/telefonica_logo.png" alt="Telefónica" />
      <Box>
        <Typography variant="h6" component="div" fontWeight={700}>
          GD_v1 – Gestión de Dependencias TI
        </Typography>
        <Typography variant="subtitle2" component="div" color="rgba(255,255,255,0.85)">
          Visibilidad integral de dependencias, métricas y tableros
        </Typography>
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
