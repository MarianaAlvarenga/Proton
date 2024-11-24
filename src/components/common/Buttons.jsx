import React from "react";
import DeleteImage from '../../assets/images/delete.png'; // Importación estática de la imagen por defecto
import ModifyImage from '../../assets/images/modify.png'; // Importación estática de la imagen de modificar
import AddImage from '../../assets/images/agregar.png';
import { useNavigate } from "react-router-dom";  // Importa useNavigate


// Componente para el botón de eliminación
const DeleteButton = ({ urlImage = DeleteImage, onClick }) => {
  return (
    <figure className="image is-inline-block" onClick={onClick}>
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

// Componente para el botón de modificación
const AddButton = ({ urlImage = AddImage, onClick }) => {
  const navigate = useNavigate();  // Inicializa el hook de navegación
  
  const handleAddUser = () => {
    navigate("/SignUp");
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
