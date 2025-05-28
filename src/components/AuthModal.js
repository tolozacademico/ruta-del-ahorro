import React, { useState } from 'react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
const [isLoginMode, setIsLoginMode] = useState(true);
const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
});

const handleInputChange = (e) => {
    setFormData({
    ...formData,
    [e.target.name]: e.target.value
    });
};

const handleSubmit = () => {
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
    }

    if (!formData.email || !formData.password) {
    alert('Por favor completa todos los campos');
    return;
    }

    // Aquí irían las llamadas a tu API
    console.log(isLoginMode ? 'Iniciando sesión...' : 'Registrando usuario...', formData);
    
    // Simular login exitoso
    onLogin({
    name: formData.name || 'Usuario',
    email: formData.email
    });
    
    // Limpiar formulario
    setFormData({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
    });
    
    onClose();
};

const handleOAuthLogin = (provider) => {
    console.log(`Iniciando sesión con ${provider}`);
    // Aquí irían las integraciones OAuth reales
    onLogin({
    name: `Usuario de ${provider}`,
    email: `usuario@${provider.toLowerCase()}.com`
    });
    onClose();
};

const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
    handleSubmit();
    }
};

if (!isOpen) return null;

return (
    <div className="auth-modal-overlay">
    <div className="auth-modal">
        <div className="auth-modal-header">
        <h2>{isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}</h2>
        <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="auth-modal-body">
        {/* Botones OAuth */}
        <div className="oauth-section">
            <button 
            className="oauth-button google-oauth"
            onClick={() => handleOAuthLogin('Google')}
            >
            <span className="oauth-icon google-icon">G</span>
            Continuar con Google
            </button>
            <button 
            className="oauth-button facebook-oauth"
            onClick={() => handleOAuthLogin('Facebook')}
            >
            <span className="oauth-icon facebook-icon">f</span>
            Continuar con Facebook
            </button>
        </div>

        <div className="divider">
            <span>o</span>
        </div>

        {/* Formulario */}
        <div className="auth-form">
            {!isLoginMode && (
            <input
                type="text"
                name="name"
                placeholder="Nombre completo"
                value={formData.name}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="auth-input"
            />
            )}
            
            <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="auth-input"
            />
            
            <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="auth-input"
            />

            {!isLoginMode && (
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="auth-input"
            />
            )}

            <button onClick={handleSubmit} className="auth-submit-button">
            {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
        </div>

        <div className="auth-switch">
            <p>
            {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            <button 
                type="button"
                className="switch-mode-button"
                onClick={() => setIsLoginMode(!isLoginMode)}
            >
                {isLoginMode ? 'Regístrate' : 'Inicia sesión'}
            </button>
            </p>
        </div>
        </div>
    </div>
    </div>
);
};

export default AuthModal;