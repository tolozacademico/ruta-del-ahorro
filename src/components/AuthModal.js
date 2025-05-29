import React, { useState } from 'react';
import './AuthModal.css';
import Axios from "axios";


const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  Axios.defaults.withCredentials = true;
  
  const Autenticar = async () => {
    try {
      const response = await Axios.post("http://localhost:3001/auth", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        onLogin(response.data.user); 
        onClose();
        limpiarFormulario();
      } else {
        alert("Usuario y/o Contraseña incorrectas");
      }
    } catch (error) {
      console.error("Error durante autenticación:", error);
      alert("Ocurrió un error durante el inicio de sesión.");
    }
  };

  const Registrar = async () => {
    try {
      const response = await Axios.post("http://localhost:3001/register", {
        email: formData.email,
        password: formData.password,
        nombre: formData.name
      });

      if (response.data.success) {
        alert("¡Usuario registrado! Ahora puedes iniciar sesión.");
        setIsLoginMode(true); // Cambia a modo login después de registrarse
        limpiarFormulario();
      } else {
        alert("Error al registrar el usuario.");
      }
    } catch (error) {
      console.error("Error durante registro:", error);
      alert("Ocurrió un error durante el registro.");
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (isLoginMode) {
      await Autenticar();
    } else {
      await Registrar();
    }
  };

  const handleOAuthLogin = () => {
    window.open('http://localhost:3001/auth/google', '_self');
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
          <div className="oauth-section">
            <button 
              className="oauth-button google-oauth"
              onClick={handleOAuthLogin}
            >
              <span className="oauth-icon google-icon">G</span>
              Continuar con Google
            </button>
          </div>

          <div className="divider">
            <span>o</span>
          </div>

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
