import React from "react";

const Header = () => {
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
        <button className="login-button">INICIA SESIÓN</button>
        </div>
    </header>
    );
};

export default Header;
