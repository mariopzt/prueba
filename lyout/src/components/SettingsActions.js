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
    nuevo: [
      'Crear usuario nuevo', 'Asignar permisos', 'Validar correo', 'Contraseña segura', 'Usuario activo',
      'Rol asignado', 'Datos obligatorios', 'Formulario simple', 'Registro exitoso', 'Notificación enviada'
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
  return (
    <div className="settings-actions">
      {opciones.map(op => (
        <div
          key={op.key}
          className={`settings-div${selected === op.key ? ' expanded' : ''}`}
          onClick={() => setSelected(selected === op.key ? '' : op.key)}
        >
          <span className="settings-div-label">{op.label}</span>
          {selected === op.key && (
            <div className="settings-lines">
              {randomLines(op.key).map((line, idx) => (
                <div className="settings-line" key={idx}>{line}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
