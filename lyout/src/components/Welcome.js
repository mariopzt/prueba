import React from 'react';

const Welcome = ({nombreUsuario, tipoUsuario }) => {
  
  return (
    <div className="welcome-card">
      <h1 className="welcome-title">
        {tipoUsuario === 'admin' ? `Bienvenido ${nombreUsuario}!` : `Bienvenido ${nombreUsuario}!`}
      </h1>
      <div className="welcome-msg">Has iniciado sesión correctamente.</div>
    </div>
  );
};

export default Welcome;

