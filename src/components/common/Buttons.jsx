import React from "react";
import DeleteImage from '../../assets/images/delete.png'; // Importación estática de la imagen por defecto
import ModifyImage from '../../assets/images/modify.png'; // Importación estática de la imagen de modificar
import AddImage from '../../assets/images/agregar.png';

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

// Exportando ambos componentes
export { DeleteButton, ModifyButton, AddButton };
