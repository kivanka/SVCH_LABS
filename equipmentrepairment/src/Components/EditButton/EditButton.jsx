function EditButton({ onEditClick, isDisabled }) {
  return (
      <button onClick={onEditClick} disabled={isDisabled}>
          Редактировать
      </button>
  );
}


export default EditButton;