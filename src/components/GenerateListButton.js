import React from 'react';

const GenerateListButton = ({ onClick, disabled }) => {
    return (
    <button 
        className={`generate-button ${disabled ? 'disabled' : ''}`}
        onClick={onClick}
        disabled={disabled}
    >
        GENERAR LISTA
    </button>
    );
};

export default GenerateListButton;