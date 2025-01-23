import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({
  ProductName = "Producto",
  ProductPrice = "0.00",
  ProductImage = "",
  ProductId,
  ShowAddButton = false,
  ShowDeleteButton = false,
  ShowModifyButton = false,
  ShowCount = false,
}) => {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);

  const handleAddClick = () => {
    navigate("/ProductsCreate");
  };

  const handleUpdateClick = () => {
    navigate(`/ProductCreateForm/${ProductId}`);
  };

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${ProductName}"?`
    );
    if (!confirmDelete) return;

    try {
      console.log("Código del producto a eliminar:", ProductId);
      const payload = { codigo_producto: ProductId };

      const response = await fetch(
        "http://localhost:8080/Proton/backend/actions/deleteProduct.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        window.location.reload();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("Error al eliminar el producto.");
    }
  };

  const incrementCount = () => {
    setProductCount((prevCount) => prevCount + 1);
  };

  const decrementCount = () => {
    if (productCount > 0) {
      setProductCount((prevCount) => prevCount - 1);
    }
  };

  return (
    <div className="card" style={{ borderRadius: "0%" }}>
      <div className="card-image" style={{ borderRadius: "0%" }}>
        <figure className="image is-4by3">
          <img
            src={
              ProductImage ||
              "https://bulma.io/assets/images/placeholders/1280x960.png"
            }
            alt="Product"
            style={{ borderRadius: "0%" }}
          />
          {ShowAddButton && (
            <button className="buttonImage add-button" onClick={handleAddClick}>
              <img
                src={require("../../assets/images/agregar.png")}
                alt="AddButton"
                style={{ fill: "black", color: "white" }}
              />
            </button>
          )}
          {ShowDeleteButton && (
            <button
              className="buttonImage delete-button"
              onClick={handleDeleteClick}
            >
              <img
                src={require("../../assets/images/delete.png")}
                alt="DeleteButton"
                style={{ fill: "black", color: "white" }}
              />
            </button>
          )}
          {ShowModifyButton && (
            <button
              className="buttonImage modify-button"
              onClick={handleUpdateClick}
            >
              <img
                src={require("../../assets/images/modify.png")}
                alt="ModifyButton"
                style={{ fill: "black", color: "white" }}
              />
            </button>
          )}
        </figure>
      </div>
      <div className="card-content">
        <p className="product-name" style={{ fontWeight: "bold" }}>
          {ProductName}
        </p>
        <p className="product-price" style={{ color: "gray" }}>
          ${ProductPrice}
        </p>
        {ShowCount && (
          <div className="product-counter">
            <button className="counter-button" onClick={decrementCount}>-</button>
            <span className="counter-value">{productCount}</span>
            <button className="counter-button" onClick={incrementCount}>+</button>
          </div>
          )}
      </div>
    </div>
  );
};

export default ProductCard;
