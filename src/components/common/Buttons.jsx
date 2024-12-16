import React from "react";
import DeleteImage from '../../assets/images/delete.png'; // Importación estática de la imagen por defecto
import ModifyImage from '../../assets/images/modify.png'; // Importación estática de la imagen de modificar
import AddImage from '../../assets/images/agregar.png';
import { useNavigate } from "react-router-dom";  // Importa useNavigate


// Componente para el botón de eliminación
const DeleteButton = ({ urlImage = DeleteImage, onDelete }) => {
  const handleDelete = () => {
    // Verifica si hay un usuario seleccionado
    const selectedCheckbox = document.querySelector('input[type="checkbox"][name="uniqueCheckbox"]:checked');
    
    if (!selectedCheckbox) {
      alert("No ha seleccionado ningún usuario para eliminar.");
      return;
    }

    // Muestra la confirmación de eliminación
    const confirmDelete = window.confirm("¿Está seguro de que desea eliminar este usuario?");
    if (confirmDelete) {
      const userId = selectedCheckbox.id.split('-')[1]; // Extrae el ID del checkbox (asume el formato 'checkbox-{id}')
      onDelete(userId); // Llama a la función pasada como prop
    }
  };

  return (
    <figure className="image is-inline-block" onClick={handleDelete}>
      <img 
        src={urlImage} 
        alt="Eliminar"
        style={{ height: '15px', width: '20px' }}
      />
    </figure>
  );
};

// Componente para el botón de modificación
const ModifyButton = ({ urlImage = ModifyImage, onClick }) => {
  return (
    <figure className="image is-inline-block" onClick={onClick}>
      <img 
        src={urlImage} 
        alt="Modificar"
        style={{ height: '15px', width: '20px' }}
      />
    </figure>
  );
};

const AddButton = ({ urlImage = AddImage, onClick }) => {
  const navigate = useNavigate();  // Inicializa el hook de navegación
  
  const handleAddUser = () => {
    navigate('/SignUp', { state: { showComboBox: true } });
  }
  
  return (
    <figure className="image is-inline-block" onClick={onClick}>
      <a role="button" onClick={handleAddUser}><img
        src={urlImage} 
        alt="Modificar"
        style={{ height: '15px', width: '20px' }}
      /></a>
    </figure>
  );
};

// Exportando ambos componentes
export { DeleteButton, ModifyButton, AddButton };
