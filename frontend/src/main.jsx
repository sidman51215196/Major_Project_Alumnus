import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthContext from './context/authContext.jsx';
import ThemeContextProvider from './context/themeContext.jsx';

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
    <AuthContext>
      <App />
    </AuthContext>
  </ThemeContextProvider>
);
