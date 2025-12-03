import React from "react";
import './ButtonPanelUsers.css';
import { AddButton, ModifyButton, DeleteButton } from "../common/Buttons";

const ButtonPanelUsers = () => {
  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch("https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/deleteUser.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId }), // Envía el ID del usuario a eliminar
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario.");
      }

      const result = await response.json();
      if (result.success) {
        alert("Usuario eliminado correctamente.");
        window.location.reload(); // Recarga la página para actualizar la tabla
      } else {
        alert("Hubo un problema al eliminar el usuario.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="button-container">
      <AddButton />
      <ModifyButton />
      <DeleteButton onDelete={handleDeleteUser} />
    </div>
  );
};


export default ButtonPanelUsers;