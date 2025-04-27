import React, { useState } from 'react';
import './settings-actions.css';

const opciones = [
  { key: 'temas', label: 'Temas', texto: 'GESTIÓN DE TEMAS' },
  { key: 'nuevo', label: 'Nuevo Usuario', texto: 'CREAR NUEVO USUARIO' },
  { key: 'cambiar', label: 'Cambiar Contraseña', texto: 'CAMBIAR CONTRASEÑA DEL USUARIO' },
  { key: 'eliminar', label: 'Eliminar Usuario', texto: 'ELIMINAR USUARIO DEFINITIVAMENTE' },
];

function randomLines(key) {
  const textos = {
    temas: [
      'Colores dinámicos', 'Modo oscuro', 'Tema claro', 'Personalización avanzada', 'Paleta de usuario',
      'Fuente adaptable', 'Contraste mejorado', 'Animaciones suaves', 'Interfaz moderna', 'Diseño responsivo'
    ],

    cambiar: [
      'Verificación actual', 'Nueva contraseña', 'Confirmar cambio', 'Seguridad reforzada', 'Requiere sesión',
      'Notificar usuario', 'Longitud mínima', 'Caracteres especiales', 'Cambio exitoso', 'Actualizar datos'
    ],
    eliminar: [
      'Confirmar eliminación', 'Usuario eliminado', 'Acción irreversible', 'Datos borrados', 'Registro eliminado',
      'Permisos revocados', 'Notificar administrador', 'Actualizar sistema', 'Eliminar dependencias', 'Proceso finalizado'
    ],
  };
  return textos[key] || [];
}

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
      const loginRes = await fetch('/api/login', {
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
      const userRes = await fetch('/api/user/add', {
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
              {op.key === 'temas' && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, background: '#1976d2', borderRadius: 4 }}></div>
                  <div style={{ width: 24, height: 24, background: '#43cea2', borderRadius: 4 }}></div>
                  <div style={{ width: 24, height: 24, background: '#f5b042', borderRadius: 4 }}></div>
                  <div style={{ width: 24, height: 24, background: '#e74c3c', borderRadius: 4 }}></div>
                </div>
              )}
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
                  <div className="settings-lines">
                    {randomLines(op.key).map((line, idx) => (
                      <div className="settings-line" key={idx}>{line}</div>
                    ))}
                  </div>
                </>
              )}
              {op.key === 'cambiar' && (
                <div style={{ marginBottom: 10 }}>
                  <input type="password" value="********" disabled style={{ fontSize: 18, padding: '4px 8px', borderRadius: 6, border: '1px solid #bbb', background: '#23272f', color: '#aaa', width: 160, textAlign: 'center' }} />
                </div>
              )}
              {op.key === 'eliminar' && (
                <div style={{ color: '#e74c3c', fontWeight: 700, marginBottom: 10 }}>
                  ¡Advertencia! Esta acción es irreversible
                </div>
              )}
              <div className="settings-lines">
                {randomLines(op.key).map((line, idx) => (
                  <div className="settings-line" key={idx}>{line}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
    </>
  );
}
