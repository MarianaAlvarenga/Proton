import React from "react";
import './ButtonPanelUsers.css';
import { AddButton, ModifyButton, DeleteButton } from "../common/Buttons";
import Alert from "../common/Alert";

const ButtonPanelUsers = ({ selectedUserId }) => {

  const handleNoSelection = (type) => {
    Alert({
      Title: "Atención",
      Detail:
        type === "delete"
          ? "No ha seleccionado ningún usuario para eliminar."
          : "No ha seleccionado ningún usuario para modificar.",
      Confirm: "Entendido",
      icon: "info"
    });
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) {
      return handleNoSelection("delete");
    }

    Alert({
      Title: "Confirmación",
      Detail: "¿Estás seguro de eliminar este usuario?",
      Confirm: "Eliminar",
      Cancel: "Cancelar",
      OnCancel: () => { },
      icon: "warning",
    }).then(async (res) => {
      if (!res.isConfirmed) return;

      try {
        const response = await fetch(
          "https://supplement-arabic-americans-fool.trycloudflare.com/backend/actions/deleteUser.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedUserId })
          }
        );

        const result = await response.json();

        if (result.success) {
          Alert({
            Title: "Éxito",
            Detail: "Usuario eliminado correctamente.",
            Confirm: "OK",
            icon: "success"
          }).then(() => window.location.reload());
        } else {
          Alert({
            Title: "Error",
            Detail: "Hubo un problema al eliminar el usuario.",
            Confirm: "OK",
            icon: "error"
          });
        }
      } catch (error) {
        Alert({
          Title: "Error",
          Detail: error.message,
          Confirm: "OK",
          icon: "error"
        });
      }
    });
  };

  return (
    <div className="button-container">
      <AddButton />
      <ModifyButton selectedUserId={selectedUserId} onNoSelection={handleNoSelection} />
      <DeleteButton selectedUserId={selectedUserId} onDelete={handleDeleteUser} onNoSelection={handleNoSelection} />
    </div>
  );
};

export default ButtonPanelUsers;
