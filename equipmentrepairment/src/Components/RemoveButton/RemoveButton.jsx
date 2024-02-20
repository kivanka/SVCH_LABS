import './style.css';

function RemoveButton({ onRemoveClick }) {
  return (
    <button className='button-remove' onClick={onRemoveClick}>Удалить</button>
  );
}

export default RemoveButton;