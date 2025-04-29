import React, { useState } from 'react';
import './settings-actions.css';
import EliminarUsuario from './EliminarUsuario';
import CambiarUsuario from './CambiarUsuario';

const opciones = [
  { key: 'nuevo', label: 'Nuevo Usuario', texto: 'CREAR NUEVO USUARIO' },
  { key: 'cambiar', label: 'Cambiar usuario y contraseña', texto: 'CAMBIAR USUARIO Y CONTRASEÑA DEL USUARIO' },
  { key: 'eliminar', label: 'Eliminar Usuario', texto: 'ELIMINAR USUARIO DEFINITIVAMENTE' },
];


const API_BASE = process.env.REACT_APP_API_BASE;

export default function SettingsActions() {
  const [selected, setSelected] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalPassword, setModalPassword] = useState('');
  const [nuevoUsername, setNuevoUsername] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [message, setMessage] = useState('');
  const [nuevoTipo, setNuevoTipo] = useState('usuario');
  // TODO: Replace with actual current username from auth/session
  const currentUsername = window.localStorage.getItem('username') || '';


  function handleNuevoUsuarioSubmit(e) {
    e.preventDefault();
    setShowModal(true);
    setMessage('');
  }

  function handleModalClose() {
    setShowModal(false);
    setModalPassword('');
  }

  async function handleModalContinue() {
    setMessage('');
    // Mostrar en consola el usuario actual y la contraseña ingresada

    try {
      const loginRes = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUsername, password: modalPassword })
      });
      let loginData = {};
      try {
        loginData = await loginRes.json();
      } catch (e) {
        // Si no es JSON, ignorar
      }

      if (!loginRes.ok) {
        setMessage('Contraseña incorrecta');
        return;
      }
      // Create new user
      const userRes = await fetch(`${API_BASE}/api/user/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: nuevoUsername, password: nuevoPassword, tipo: nuevoTipo })
      });
      if (userRes.ok) {
        setMessage('Usuario creado exitosamente.');
        setNuevoUsername('');
        setNuevoPassword('');
        setShowModal(false);
        setModalPassword('');
        setNuevoTipo('usuario');
      } else {
        const data = await userRes.json();
        setMessage(data.error || 'Error al crear el usuario.');
      }
    } catch (err) {
      setMessage('Error de red o del servidor.');

    }
  }

  return (
    <>
      {showModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="settings-modal-title">Por favor escriba su contraseña</div>
            <input
              type="password"
              className="settings-input settings-modal-input"
              placeholder="Contraseña"
              value={modalPassword}
              onChange={e => setModalPassword(e.target.value)}
            />
            {message && <div className="settings-message settings-modal-message">{message}</div>}
            <div className="settings-modal-btns">
              <button className="settings-modal-btn settings-modal-btn-continuar" onClick={handleModalContinue}>Continuar</button>
              <button className="settings-modal-btn settings-modal-btn-cerrar" onClick={handleModalClose}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
      <div className="settings-actions">
      {opciones.map(op => (
        <div
          key={op.key}
          className={`settings-div${selected === op.key ? ' expanded' : ''}`}
          onClick={() => { if (selected !== op.key) setSelected(op.key); }}
        >
          <span className="settings-div-label">{op.label}</span>
          {selected === op.key && (
            <div className="settings-special-content">
              
              {op.key === 'nuevo' && (
                <>
                  <form className="settings-user-form" autoComplete="off" onSubmit={handleNuevoUsuarioSubmit}>
                    <label className="settings-label">
                      Nombre
                      <input  type="text" name="nuevo-username" className="settings-input settings-input-nuevo" value={nuevoUsername} onChange={e => setNuevoUsername(e.target.value)} />
                    </label>
                    <label className="settings-label">
                      Contraseña
                      <input type="password" name="nuevo-password" className="settings-input settings-input-nuevo" value={nuevoPassword} onChange={e => setNuevoPassword(e.target.value)} />
                    </label>
                    <label className="settings-label">
                      Tipo de cuenta
                      <select name="nuevo-tipo" className="settings-input settings-input-nuevo" value={nuevoTipo} onChange={e => setNuevoTipo(e.target.value)}>
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </label>
                    <button type="submit" className="settings-save-btn">Guardar</button>
                  </form>
                  {message && <div className="settings-message">{message}</div>}
                  
                </>
              )}
              {op.key === 'cambiar' && (
                <CambiarUsuario currentUsername={currentUsername} />
              )}
              {op.key === 'eliminar' && (
                <>
                  <div style={{ color: '#e74c3c', fontWeight: 700, marginBottom: 10 }}>
                    ¡Advertencia! Esta acción es irreversible
                  </div>
                  <EliminarUsuario onContinue={(usuario) => {
                    // Aquí puedes manejar la lógica de eliminación
                    alert('Eliminar usuario: ' + usuario);
                  }} />
                </>
              )}
              
            </div>
          )}
        </div>
      ))}
    </div>
    </>
  );
}
