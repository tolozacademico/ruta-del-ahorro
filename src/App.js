import React, { useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import GenerateListButton from './components/GenerateListButton';
import './styles/App.css';

function App() {
  const [products, setProducts] = useState(['Producto 1', 'Producto 2']);
  const [newProduct, setNewProduct] = useState('');

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
    // Aquí puedes implementar la lógica para generar la lista
    // Por ejemplo, enviar a una API, descargar como PDF, etc.
    console.log('Lista generada:', products);
    alert(`Lista generada con ${products.length} productos`);
  };

  return (
    <div className="app">
      <Header />
      
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
    </div>
  );
}

export default App;
