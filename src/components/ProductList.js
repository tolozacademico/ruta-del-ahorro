import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ProductList = ({ products, onRemoveProduct }) => {
    return (
    <div className="product-list">
        {products.map((product, index) => (
        <div key={index} className="product-item">
            <span className="product-name">{product}</span>
            <button 
            onClick={() => onRemoveProduct(index)}
            className="remove-button"
            title="Eliminar producto"
            >
            <FaTimes />
            </button>
        </div>
        ))}
    </div>
    );
};

export default ProductList;