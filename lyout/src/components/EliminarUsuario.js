import React, { useState } from 'react';

export default function EliminarUsuario() {
  const [usuario, setUsuario] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const currentUsername = localStorage.getItem('username') || '';

  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [modalPassword, setModalPassword] = useState('');

  async function handleContinue() {
    setError('');
    setChecking(true);
    // Verifica si existe el usuario
    try {
      const API_BASE = process.env.REACT_APP_API_BASE;
      const res = await fetch(`${API_BASE}/api/user/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usuario })
      });
      const data = await res.json();
      if (res.ok && data.exists) {
        setShowPasswordModal(true);
      } else {
        setError('Usuario no encontrado');
      }
    } catch (err) {
      setError('Error de red');
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="eliminar-usuario-container">
      {showPasswordModal && (
        <div className="eliminar-usuario-modal-overlay">
          <div className="eliminar-usuario-modal">
            <div className="settings-label" style={{marginBottom: 8}}>Contraseña</div>
            <input
              type="password"
              className="settings-input settings-modal-input"
              placeholder="Contraseña"
              value={modalPassword}
              onChange={e => setModalPassword(e.target.value)}
            />
            {error && (
              <div style={{ color: '#e74c3c', marginTop: 10, marginBottom: 4, fontWeight: 500, fontSize: 15 }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button
                className="settings-save-btn eliminar-modal-btn"
                style={{ minWidth: 120 , paddingBottom: 12 }}
                onClick={async () => {
                // Validar contraseña del usuario ACTUAL antes de eliminar
                try {
                  const loginRes = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: currentUsername, password: modalPassword })
                  });
                  const loginData = await loginRes.json();
                  if (loginRes.ok) {
                    // Si login OK, eliminar usuario
                    const deleteRes = await fetch('/api/user/delete', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username: usuario })
                    });
                    const deleteData = await deleteRes.json();
                    if (deleteRes.ok) {
                      setShowPasswordModal(false);
                      setUsuario('');
                      setModalPassword('');
                      setError('');
                      alert('Usuario eliminado correctamente');
                    } else {
                      setError(deleteData.message || 'Error al eliminar usuario');
                    }
                  } else {
                    setError('Contraseña incorrecta');
                  }
                } catch (err) {
                  setError('Error de red o del servidor');
                  console.error('Error al eliminar usuario:', err);
                }
              }}
            >
              Eliminar 
           </button>
              <button
                className="settings-save-btn eliminar-modal-btn"
                style={{ minWidth: 120 }}
                onClick={() => {
                  setShowPasswordModal(false);
                  setModalPassword('');
                  setError('');
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="eliminar-usuario-inner">
        <label className="settings-label" htmlFor="eliminar-usuario-input">Usuario</label>
        <input
          id="eliminar-usuario-input"
          type="text"
          className="settings-input settings-input-nuevo"
          value={usuario}
          onChange={e => setUsuario(e.target.value)}
          placeholder="Nombre de usuario"
        />
        <button
          className="settings-save-btn"
          style={{ marginTop: 10 }}
          onClick={handleContinue}
          disabled={checking}
        >
          Continuar
        </button>
        {error && <div className="settings-message" style={{marginTop: 8, color: '#e74c3c'}}>{error}</div>}
      </div>
    </div>
  );
}
