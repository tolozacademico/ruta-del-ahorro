// components/Header.js
import React from 'react';

const Header = ({ user, onLoginClick, userMenuComponent }) => {
    return (
        <header className="header">
        <div className="header-content">
            <div className="logo-section">
                <div className="logo-container">
                    <img src={require("../assets/images/favicon.ico")}  alt="Logo" className="logo" />
                </div>
                <div className="location-info">
                    <span className="location-text">Ruta Del Ahorro</span>
                </div>
            </div>
            
            <div className="auth-section">
            {user ? (
                userMenuComponent
            ) : (
                <button onClick={onLoginClick} className="login-button">
                INICIA SESIÓN
                </button>
            )}
            </div>
        </div>
        </header>
    );
};

export default Header;