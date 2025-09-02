import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './App';
import './index.css';

// MUI Theme
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'; // <-- the theme.js we created

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* resets and applies global dark/light styles */}
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
