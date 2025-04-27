import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/welcome.css';
import { SnackbarProvider, useSnackbar } from 'notistack';
import './App.css';
import './styles/login.css';
import './styles/autocomplete-compact.css';
import './styles/media-navbar.css';
import Hero from './components/Hero';
import Welcome from './components/Welcome';
import ErrorBoundary from './components/ErrorBoundary';
import { Container, CssBaseline, createTheme, ThemeProvider, Box, Typography, Paper } from '@mui/material';
import ItemForm from './components/ItemForm';
import SubtractForm from './components/SubtractForm';
import EnFaltaList from './components/EnFaltaList';
import ItemList from './components/ItemList';
import Navbar from './components/Navbar';
import SettingsActions from './components/SettingsActions';
import axios from 'axios';

// Login comnent
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Cambia la URL si tu backend está en otro puerto o dominio
      const response = await axios.post(`${process.env.REACT_APP_API_BASE}/api/login`, { username, password });
      // Guarda los datos en localStorage y pásalos a App.js
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('loggedUser', response.data.username);
      localStorage.setItem('tipoUsuario', response.data.tipo);
      localStorage.setItem('username', response.data.username); // <-- para SettingsActions.js
      // Pasa ambos datos a App.js (nombre de usuario y tipo)
      onLogin({ username: response.data.username, tipo: response.data.tipo });
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    }
  };


  return (
    <div className="login-bg">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Iniciar sesión</h2>
        <div>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-button">Entrar</button>
      </form>
    </div>
  );
}


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});


const AppContent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [currentTab, setCurrentTab] = useState('hero');

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE}/api/items/`);
      console.log('Respuesta de items:', response.data); // DEBUG
      setItems(response.data);
    } catch (error) {
      console.error('Error al obtener items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleItemAdded = (newItem) => {
    fetchItems();
    enqueueSnackbar('¡Item agregado exitosamente!', { 
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };

  const handleItemUpdated = (updatedItem) => {
    fetchItems();
  };

  const handleItemDeleted = (itemId) => {
    fetchItems();
  };

  const safeItems = Array.isArray(items) ? items : [];

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="main-content">
          <Navbar 
            currentTab={currentTab} 
            onTabChange={setCurrentTab} 
            showHeroButton={true} 
            lowStockCount={safeItems.filter(item => item.cantidad <= 2).length}
            missingCount={safeItems.filter(item => item.cantidad === 0).length}
            tipoUsuario={localStorage.getItem('tipoUsuario') || ''}
          />
          {currentTab === 'hero' && (
            <Hero onTabChange={setCurrentTab} />
          )}
          {currentTab !== 'hero' && (
            <>
              <div className="welcome-section">
                {currentTab === 'ajustes' ? (
                  <SettingsActions />
                ) : (
                  <>
                    <p className="welcome-title">Stock Bodega</p>
                    <p className="welcome-desc">Sistema de control y gestión de productos</p>
                  </>
                )}
              </div>
              <div className="container">
                {currentTab === 'list' && (
                  <div className="itemlist-all">
                    <ItemList 
                      items={safeItems.filter(item => item.cantidad > 0)} 
                      onItemUpdated={handleItemUpdated}
                      onItemDeleted={handleItemDeleted}
                    />
                  </div>
                )}
                {currentTab === 'add' && (
                  <div className='form-container-boton' >
                    <ItemForm onItemAdded={handleItemAdded} />
                  </div>
                )}
                {currentTab === 'subtract' && (
                  <div className='form-container-boton'>
                    <SubtractForm onItemUpdated={handleItemUpdated} />
                  </div>
                )}
                {currentTab === 'enfalta' && (
                  <div className="form-container-boton">
                    <EnFaltaList 
                      items={Array.isArray(items) ? items : []} 
                      onItemUpdated={handleItemUpdated}
                      onItemDeleted={handleItemDeleted}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

function App() {
  // Sincroniza claves al cargar la app
  useEffect(() => {
    const loggedUser = localStorage.getItem('loggedUser');
    if (loggedUser && !localStorage.getItem('username')) {
      localStorage.setItem('username', loggedUser);
    }
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [showWelcome, setShowWelcome] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('loggedUser') || '');
  const [tipoUsuario, setTipoUsuario] = useState(localStorage.getItem('tipoUsuario') || '');

  // Modifica el login para guardar el usuario y tipo
  const handleLogin = (loginData) => {
    // Guarda ambos valores en el estado de App.js y en localStorage
    setIsLoggedIn(true);
    setUsername(loginData.username);
    setTipoUsuario(loginData.tipo);
    localStorage.setItem('loggedUser', loginData.username);
    localStorage.setItem('tipoUsuario', loginData.tipo);
    setShowWelcome(true);
    setTimeout(() => setShowWelcome(false), 2000);
    localStorage.removeItem('lowStockNotified'); // Reinicia el aviso de bajo stock al iniciar sesión
  };

  // Si no está logueado, muestra el login
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Si está logueado pero debe mostrar bienvenida
  if (showWelcome) {
    return (
      <div className="welcome-bg">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="welcome-card"
        >
          {/* Nuevo layout de botones de ajustes */}
          <Welcome nombreUsuario={username} tipoUsuario={tipoUsuario} />
        </motion.div>
      </div>
    );
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <AppContent />
    </SnackbarProvider>
  );
}

export default App;
