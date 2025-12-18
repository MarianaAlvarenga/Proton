import React from "react";
import DeleteImage from "../../assets/images/delete.png";
import ModifyImage from "../../assets/images/modify.png";
import AddImage from "../../assets/images/agregar.png";
import { useNavigate } from "react-router-dom";

const DeleteButton = ({ urlImage = DeleteImage, onDelete, selectedUserId, onNoSelection }) => {
  const handleDelete = () => {
    if (!selectedUserId) {
      onNoSelection && onNoSelection("delete");
      return;
    }
    onDelete(selectedUserId);
  };

  return (
    <figure className="image is-inline-block" onClick={handleDelete}>
      <img src={urlImage} alt="Eliminar" style={{ height: "15px", width: "20px" }} />
    </figure>
  );
};

const ModifyButton = ({ urlImage = ModifyImage, selectedUserId, onNoSelection }) => {
  const navigate = useNavigate();

  const handleModify = () => {
    if (!selectedUserId) {
      onNoSelection && onNoSelection("modify");
      return;
    }

    fetch("https://charter-driver-acid-smile.trycloudflare.com/backend/actions/getUserById.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selectedUserId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate("/SignUp", {
            state: {
              userData: data.user,
              isEditMode: true,
              showComboBox: false,
              imageUrl: data.user.img_url || null,
            },
          });
        } else {
          onNoSelection && onNoSelection("modify-error");
        }
      })
      .catch(() => onNoSelection && onNoSelection("server-error"));
  };

  return (
    <figure className="image is-inline-block" onClick={handleModify}>
      <img src={urlImage} alt="Modificar" style={{ height: "15px", width: "20px" }} />
    </figure>
  );
};

const AddButton = ({ urlImage = AddImage }) => {
  const navigate = useNavigate();

  return (
    <figure className="image is-inline-block" onClick={() => navigate("/SignUp", { state: { showComboBox: true } })}>
      <img src={urlImage} alt="Agregar" style={{ height: "15px", width: "20px" }} />
    </figure>
  );
};

export { DeleteButton, ModifyButton, AddButton };
