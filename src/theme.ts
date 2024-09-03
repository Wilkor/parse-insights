// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#9362f5', // Azul padrão
    },
    secondary: {
      main: '#dc004e', // Rosa padrão
    },
    background: {
      default: '#f4f6f8', // Cor de fundo padrão
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Arredondando os botões
        },
      },
    },
  },
});

export default theme;
