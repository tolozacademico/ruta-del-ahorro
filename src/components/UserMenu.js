import React from 'react';
import './UserMenu.css';

const UserMenu = ({ user, onLogout }) => {
return (
    <div className="user-menu">
    <span className="user-greeting">Hola, {user.nombre}</span>
    <button onClick={onLogout} className="logout-button">
        Cerrar Sesión
    </button>
    </div>
);
};

export default UserMenu;