import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';  // Certifique-se de que o nome e o caminho estejam corretos
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';  // Tema padrão
import blipTheme from './blipTheme';  // Tema específico para "blip-ai"
import { IframeMessageProxy } from 'iframe-message-proxy'

function uuidv4(): string {
  return (Math.random() + 1).toString(36).substring(7);
}

function createPostMessage() {
  const eventCaller: string = window.name; // Tipando como string

  const trackingProperties = {
    id: uuidv4(),
    referrer: document.referrer 
  };

  const message = {
    message: {
      action: `blipEvent:heightChange`,
      content: 600,
      caller: eventCaller
    },
    trackingProperties
  };
  
  return message;
}

const eventCaller: string = window.name;  // Tipando como string
const appliedTheme = eventCaller !== 'blip-ai' ? blipTheme : theme;

window.parent.postMessage(createPostMessage(), '*');
IframeMessageProxy.listen()

ReactDOM.render(
  <ThemeProvider theme={appliedTheme}>
    <CssBaseline />
    <App eventCaller={eventCaller} />
  </ThemeProvider>,
  document.getElementById('root')
);
