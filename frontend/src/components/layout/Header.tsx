import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { COLORS } from '../../theme';

const TELEFONICA_LOGO_DATA_URI = 'data:image/png;base64,' +
  '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';

const ContrastAppBar = styled(AppBar)(() => ({
  background: `linear-gradient(90deg, ${COLORS.DARK} 0%, #00386a 55%, ${COLORS.PRIMARY} 100%)`,
  color: '#f7fbff',
  borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`
}));

const Logo = styled('img')({
  height: 40,
  marginRight: 16
});

const Header = () => (
  <ContrastAppBar position="fixed" elevation={2}>
    <Toolbar>
      <Logo src={TELEFONICA_LOGO_DATA_URI} alt="Telefónica" />
      <Box>
        <Typography variant="h6" component="div" fontWeight={800} sx={{ letterSpacing: 0.2 }}>
          GD_v1 – Gestión de Dependencias TI
        </Typography>
        <Typography
          variant="subtitle2"
          component="div"
          sx={{ color: 'rgba(255,255,255,0.92)', fontWeight: 500 }}
        >
          Visibilidad integral de dependencias, métricas y tableros
        </Typography>
      </Box>
    </Toolbar>
  </ContrastAppBar>
);

export default Header;
