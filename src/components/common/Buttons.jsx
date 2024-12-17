import React from "react";
import DeleteImage from "../../assets/images/delete.png";
import ModifyImage from "../../assets/images/modify.png";
import AddImage from "../../assets/images/agregar.png";
import { useNavigate } from "react-router-dom";

// Botón de eliminación
const DeleteButton = ({ urlImage = DeleteImage, onDelete }) => {
  const handleDelete = () => {
    const selectedCheckbox = document.querySelector('input[type="checkbox"][name="uniqueCheckbox"]:checked');
    if (!selectedCheckbox) {
      alert("No ha seleccionado ningún usuario para eliminar.");
      return;
    }

    const confirmDelete = window.confirm("¿Está seguro de que desea eliminar este usuario?");
    if (confirmDelete) {
      const userId = selectedCheckbox.id.split("-")[1];
      onDelete(userId);
    }
  };

  return (
    <figure className="image is-inline-block" onClick={handleDelete}>
      <img src={urlImage} alt="Eliminar" style={{ height: "15px", width: "20px" }} />
    </figure>
  );
};

// Botón de modificación
const ModifyButton = ({ urlImage = ModifyImage }) => {
  const navigate = useNavigate();

  const handleModify = () => {
    const selectedCheckbox = document.querySelector('input[type="checkbox"][name="uniqueCheckbox"]:checked');
    if (!selectedCheckbox) {
      alert("No ha seleccionado ningún usuario para modificar.");
      return;
    }

    const userId = selectedCheckbox.id.split("-")[1]; // Extraer el ID del usuario seleccionado

    // Fetch para obtener los datos del usuario seleccionado
    fetch("http://localhost:8080/Proton/backend/actions/getUserById.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/SignUp", {
            state: { userData: data.user, isEditMode: true, showComboBox: false },
          });
        } else {
          alert("Error al obtener los datos del usuario.");
        }
      })
      .catch(() => alert("Error de conexión con el servidor."));
  };

  return (
    <figure className="image is-inline-block" onClick={handleModify}>
      <img src={urlImage} alt="Modificar" style={{ height: "15px", width: "20px" }} />
    </figure>
  );
};

const AddButton = ({ urlImage = AddImage }) => {
  const navigate = useNavigate();

  const handleAddUser = () => {
    navigate("/SignUp", { state: { showComboBox: true }, });
  };
    
    return (
      
    <figure className="image is-inline-block" onClick={handleAddUser}>
      <img src={urlImage} alt="Agregar" style={{ height: "15px", width: "20px" }} />

    </figure>
      
  );
};

export { DeleteButton, ModifyButton, AddButton };
