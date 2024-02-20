import React from 'react';
import './style.css';

function AddCardButton({ onAddClick }) {
  return (
    <button onClick={onAddClick}>Добавить карточку</button>
  );
}

export default AddCardButton;