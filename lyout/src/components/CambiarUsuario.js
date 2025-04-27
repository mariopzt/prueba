import React, { useState } from 'react';
import './settings-actions.css';

const API_BASE = process.env.REACT_APP_API_BASE;

export default function CambiarUsuario({ currentUsername = '' }) {
  const [usuario, setUsuario] = useState(currentUsername || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      // 1. Validar solo la contraseña antigua (no revises si el usuario nuevo es igual o diferente)
      const loginRes = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUsername, password: oldPassword })
      });
      if (!loginRes.ok) {
        setMessage('Contraseña antigua incorrecta');
        setLoading(false);
        return;
      }
      // 2. Actualizar usuario y contraseña
      if (usuario && newPassword) {
        // Cambia usuario
        const updateUserRes = await fetch(`${API_BASE}/api/user/update-username`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldUsername: currentUsername, newUsername: usuario })
        });
        if (!updateUserRes.ok) {
          setMessage('Error al actualizar el usuario');
          setLoading(false);
          return;
        }
        // Cambia contraseña
        const updatePassRes = await fetch(`${API_BASE}/api/user/update-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: usuario, newPassword })
        });
        if (!updatePassRes.ok) {
          setMessage('Usuario cambiado, pero error al actualizar la contraseña');
          setLoading(false);
          return;
        }
        setMessage('Usuario y contraseña actualizados. Debes iniciar sesión de nuevo.');
      } else {
        setMessage('Debes ingresar un nuevo usuario y contraseña.');
        setLoading(false);
        return;
      }
      setTimeout(() => {
        localStorage.removeItem('username');
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('tipoUsuario');
        localStorage.removeItem('isLoggedIn');
        window.location.reload();
      }, 1800);
    } catch (err) {
      setMessage('Error de red o del servidor');
    }
    setLoading(false);
  }

  return (
    <form className="cambiar-usuario-root" style={{ width: '100%', maxWidth: 350, margin: '0 auto', padding: 16, background: 'transparent' }} onSubmit={handleSubmit}>
      <div className="cambiar-usuario-field" style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', color: '#5e6e88', fontWeight: 500, marginBottom: 6 }}>Nuevo usuario</label>
        <input
          className="settings-input"
          style={{ color: '#5e6e88' }}
          type="text"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          placeholder="Nuevo usuario"
          autoComplete="username"
        />
      </div>
      <div className="cambiar-usuario-field" style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', color: '#5e6e88', fontWeight: 500, marginBottom: 6 }}>Contraseña actual</label>
        <input
          className="settings-input"
          style={{ color: '#5e6e88' }}
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          placeholder="Contraseña actual"
          autoComplete="current-password"
        />
      </div>
      <div className="cambiar-usuario-field" style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', color: '#5e6e88', fontWeight: 500, marginBottom: 6 }}>Nueva contraseña</label>
        <input
          className="settings-input"
          style={{ color: '#5e6e88' }}
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="Nueva contraseña"
          autoComplete="new-password"
        />
      </div>
      {message && <div style={{ color: message.includes('incorrecta') ? '#e74c3c' : '#5e6e88', margin: '14px 0 0 0', fontWeight: 500 }}>{message}</div>}
      <button className="settings-save-btn" style={{ marginTop: 18 }} disabled={loading}>
        Continuar
      </button>
    </form>
  );
}

