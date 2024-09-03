import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // Certifique-se de que o nome e o caminho estejam corretos
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';  // Tema padrão
import blipTheme from './blipTheme';  // Tema específico para "blip-ai"


const eventCaller: string = window.name;  // Tipando como string
const appliedTheme = eventCaller !== 'blip-ai' ? blipTheme : theme;


ReactDOM.render(
  <ThemeProvider theme={appliedTheme}>
    <CssBaseline />
    <App eventCaller={eventCaller} />
  </ThemeProvider>,
  document.getElementById('root')
);
