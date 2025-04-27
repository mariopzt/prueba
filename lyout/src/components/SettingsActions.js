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

  function handleNuevoUsuarioSubmit(e) {
    e.preventDefault();
    setShowModal(true);
  }

  function handleModalClose() {
    setShowModal(false);
    setModalPassword('');
  }

  function handleModalContinue() {
    // Aquí podrías manejar la lógica de validación o envío
    setShowModal(false);
    setModalPassword('');
    // ...
  }

  return (
    <>
      {showModal && (
        <div className="settings-modal-overlay">
          <div className="settings-modal">
            <div className="settings-modal-title">Por favor escriba su contraseña</div>
            <input
              type="password"
              className="settings-input"
              placeholder="Contraseña"
              value={modalPassword}
              onChange={e => setModalPassword(e.target.value)}
              style={{ width: '100%', margin: '20px 0 18px 0', padding: '10px', fontSize: 17, borderRadius: 6 }}
            />
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' , marginTop: 10 }}>
              <button className="settings-modal-btn" style={{ background: '#1976d2', color: '#fff', padding: '8px 24px', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={handleModalContinue}>Continuar</button>
              <button className="settings-modal-btn" style={{ background: '#e74c3c', color: '#fff', padding: '8px 24px', borderRadius: 6, border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={handleModalClose}>Cerrar</button>
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
                  <form className="settings-user-form" autoComplete="off" onSubmit={handleNuevoUsuarioSubmit} style={{ marginBottom: 10, width: '100%', maxWidth: 320 }}>
                    <label style={{ display: 'block', marginBottom: 8, color: '#5e6e88', fontWeight: 500, fontSize: 15 }}>
                      Nombre
                      <input type="text" name="nuevo-username" className="settings-input" style={{ width: '100%', marginTop: 4, marginBottom: 14, padding: '7px 8px', borderRadius: 6, border: '1px solid #bbb', color: '#e6e6e6', fontSize: 15 }} />
                    </label>
                    <label style={{ display: 'block', marginBottom: 8, color: '#5e6e88', fontWeight: 500, fontSize: 15 }}>
                      Contraseña
                      <input type="password" name="nuevo-password" className="settings-input" style={{ width: '100%', marginTop: 4, marginBottom: 8, padding: '7px 8px', borderRadius: 6, border: '1px solid #bbb', color: '#e6e6e6', fontSize: 15 }} />
                    </label>
                    <button type="submit" className="settings-save-btn" style={{ width: '100%', padding: '9px 0', borderRadius: 6, background: '#1976d2', color: '#fff', fontWeight: 700, border: 'none', fontSize: 16, marginTop: 6, cursor: 'pointer' }}>
                      Guardar
                    </button>
                  </form>
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
