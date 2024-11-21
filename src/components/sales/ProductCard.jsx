import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css"; // Asegúrate de importar el archivo CSS

const ProductCard = ({ ProductName = "Producto", ProductPrice = "0.00", ProductImage = "", ShowAddButton = false, ShowDeleteButton = false, ShowModifyButton = false }) => {
  const navigate = useNavigate();

  // Función para manejar la redirección al formulario de creación
  const handleAddClick = () => {
    navigate("/ProductCreateForm");
  };

  return (
    <div className="card" style={{ borderRadius: '0%' }}>
      <div className="card-image" style={{ borderRadius: '0%' }}>
        <figure className="image is-4by3">
          <img
            src={ProductImage || "https://bulma.io/assets/images/placeholders/1280x960.png"}
            alt="Product"
            style={{ borderRadius: '0%' }}
          />
          {ShowAddButton && (
            <button className="buttonImage add-button" onClick={handleAddClick}>
              <img
                src={require("../../assets/images/agregar.png")}
                alt="AddButton"
                style={{ fill: 'black', color: 'white' }}
              />
            </button>
          )}
          {ShowDeleteButton && (
            <button className="buttonImage delete-button">
              <img
                src={require("../../assets/images/delete.png")}
                alt="DeleteButton"
                style={{ fill: 'black', color: 'white' }}
              />
            </button>
          )}
          {ShowModifyButton && (
            <button className="buttonImage modify-button">
              <img
                src={require("../../assets/images/modify.png")}
                alt="ModifyButton"
                style={{ fill: 'black', color: 'white' }}
              />
            </button>
          )}
        </figure>
      </div>
      <div className="card-content">
        <p className="product-name" style={{ fontWeight: "bold" }}>{ProductName}</p>
        <p className="product-price" style={{ color: "gray" }}>${ProductPrice}</p>
      </div>
    </div>
  );
};

export default ProductCard;
