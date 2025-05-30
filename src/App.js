import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import GenerateListButton from './components/GenerateListButton';
import MapView from './components/MapView';
import AuthModal from './components/AuthModal';
import UserMenu from './components/UserMenu';
import './styles/App.css';
import './styles/MapView.css';
import Axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState('');
  const [currentView, setCurrentView] = useState('list'); // 'list' o 'map'
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null); // Estado de usuario
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  Axios.defaults.withCredentials = true;

  // Verificar autenticación al cargar la app
  useEffect(() => {
    Axios.get('http://localhost:3001/auth/user', { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        // Usuario no autenticado
      });
  }, []);

  // Cargar productos cuando el usuario esté autenticado
  useEffect(() => {
    if (user) {
      loadProducts();
    } else {
      // Si no hay usuario, usar productos por defecto o limpiar lista
      setProducts([]);
    }
  }, [user]);

  // Función para cargar productos desde la base de datos
  const loadProducts = async () => {
      if (!user) return;
  
  setLoading(true);
  setError(null);

  try {
    const response = await Axios.get(`http://localhost:3001/productos/${user.id}`);

    if (response.data.success) {
      // Extraer solo los nombres para mantener compatibilidad con tu componente
      const productNames = response.data.productos.map(producto => producto.nombre);
      setProducts(productNames);
    } else {
      setError(response.data.message);
    }
  } catch (err) {
    console.error('Error al cargar productos:', err);
    setError('Error al cargar productos');
    if (err.response?.status === 401) {
      setProducts([]);
    }
  } finally {
    setLoading(false);
  }
  };

  // Función para agregar producto (solo al estado local)
  const addProduct = () => {
    if (newProduct.trim() === '') return;
    setProducts([...products, newProduct.trim()]);
    setNewProduct('');
  };

  // Función para eliminar producto individual (solo del estado local)
  const removeProduct = (index) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Función para guardar toda la lista en la base de datos
  const saveProductList = async () => {
    if (!user) {
      alert('Debes iniciar sesión para guardar tu lista');
      return;
    }

    if (products.length === 0) {
      alert('No hay productos para guardar');
      return;
    }
   
    setLoading(true);
    setError(null); 

      try {
    const response = await Axios.post("http://localhost:3001/productos/update", {
      id_usuario: user.id,
      productos: products, // debe ser un array de strings
    });

    if (response.data.success) {
      alert("Productos guardados exitosamente");
    } else {
      alert("Hubo un problema al guardar los productos");
    }
  } catch (error) {
    console.error("Error al guardar productos:", error);
    alert("Error del servidor al guardar productos");
  }

    
  };

  // Función para limpiar toda la lista
  const clearAllProducts = async () => {
    if (products.length === 0) return;

    const confirmClear = window.confirm('¿Estás seguro de que quieres eliminar toda la lista?');
    if (!confirmClear) return;
  
    setProducts([]);
    
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
    // Los productos se cargarán automáticamente por el useEffect
  };

  const handleLogout = async () => {
    try {
      await Axios.get('http://localhost:3001/auth/logout');
      setUser(null);
      setProducts([]); // Limpiar productos al hacer logout
      console.log('Usuario deslogueado');
    } catch (err) {
      console.error('Error al hacer logout:', err);
      // Limpiar estado local aunque haya error
      setUser(null);
      setProducts([]);
    }
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
              <p className="subtitle">
                {user ? `Hola ${user.nombre}, aquí tienes tus productos guardados` : 'Inicia sesión para guardar tus productos'}
              </p>
              
            
              
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
                <button 
                  onClick={addProduct} 
                  className="add-button"
                  disabled={newProduct.trim() === ''}
                >
                  Agregar
                </button>
              </div>

              <div className="list-actions">
                <button 
                  onClick={saveProductList}
                  className="add-button"
                  disabled={ products.length === 0 || !user}
                >
                  Guardar Lista
                </button>

                <button 
                  onClick={clearAllProducts}
                  className="delete-button"
                  disabled={ products.length === 0}
                >
                   Limpiar Lista
                </button>
              </div>
              
              <GenerateListButton 
                onClick={generateList}
                disabled={products.length === 0 || loading}
              />

              {!user && (
                <div className="login-prompt" style={{
                  background: '#fff3e0',
                  color: '#ef6c00',
                  padding: '15px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  textAlign: 'center'
                }}>
                  💡 <strong>Tip:</strong> Inicia sesión para guardar tus productos y acceder a ellos desde cualquier dispositivo
                </div>
              )}
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