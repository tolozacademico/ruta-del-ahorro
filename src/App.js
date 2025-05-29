import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import GenerateListButton from './components/GenerateListButton';
import MapView from './components/MapView';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import './styles/App.css';
import './styles/MapView.css';
import { useEffect } from 'react';
import Axios from "axios";

function App() {
  const [products, setProducts] = useState(['Producto 1', 'Producto 2']);
  const [newProduct, setNewProduct] = useState('');
  const [currentView, setCurrentView] = useState('list'); // 'list' o 'map'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Estado de usuario

    Axios.defaults.withCredentials = true;
    useEffect(() => {
    // Verifica si ya hay sesión activa al cargar la app (ej. al volver de Google)
    Axios.get('http://localhost:3001/auth/user', { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
      
      });
  }, []);

  const addProduct = () => {
    if (newProduct.trim() !== '') {
      setProducts([...products, newProduct]);
      setNewProduct('');
    }
  };

  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  const generateList = () => {
    if (products.length === 0) {
      alert('Agrega al menos un producto a la lista');
      return;
    }
    setCurrentView('map');
  };

  const handleLogin = (userData) => {
    setUser(userData);
    console.log('Usuario logueado:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    console.log('Usuario deslogueado');
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="app">
      {currentView === 'list' ? (
        <>
          <Header 
            user={user}
            onLoginClick={openAuthModal}
            userMenuComponent={user ? <UserMenu user={user} onLogout={handleLogout} /> : null}
          />
          
          <main className="main-content">
            <div className="container">
              <h2 className="title">Agrega tus productos</h2>
              <p className="subtitle">Sigue este formato</p>
              
              <ProductList
                products={products}
                onRemoveProduct={removeProduct}
              />
              
              <div className="add-product-section">
                <input
                  type="text"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  placeholder="Agregar nuevo producto"
                  className="product-input"
                  onKeyPress={(e) => e.key === 'Enter' && addProduct()}
                />
                <button onClick={addProduct} className="add-button">
                  Agregar
                </button>
          
              </div>
              
              <GenerateListButton 
                onClick={generateList}
                disabled={products.length === 0}
              />
            </div>
          </main>
        </>
      ) : (
        <MapView 
          products={products}
          onBack={() => setCurrentView('list')}
        />
      )}

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;