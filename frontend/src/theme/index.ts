import { createTheme } from '@mui/material/styles';

export const COLORS = {
  PRIMARY: '#00a9e0',
  DARK: '#001b3c',
  LIGHT_BG: '#f5f9fc',
  CARD_BORDER: '#d0d7de'
};

const theme = createTheme({
  palette: {
    primary: {
      main: COLORS.PRIMARY
    },
    secondary: {
      main: COLORS.DARK
    },
    background: {
      default: COLORS.LIGHT_BG
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Inter", system-ui, -apple-system, sans-serif'
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: COLORS.CARD_BORDER,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 12
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.DARK
        }
      }
    }
  }
});

export default theme;
