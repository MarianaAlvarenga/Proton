import React from "react";
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
}) => {
  const navigate = useNavigate();

  // Función para manejar la redirección al formulario de creación
  const handleAddClick = () => {
    navigate("/ProductsCreate");
  };
  
  // Función para manejar la redirección al formulario de edición

  const handleUpdateClick = () => {
    navigate(`/ProductCreateForm/${ProductId}`); // Redirige a ProductCreateForm con el productId
  };
  
 // Función para manejar la eliminación del producto
const handleDeleteClick = async () => {
  const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el producto "${ProductName}"?`);
  if (!confirmDelete) return;

  try {
    // Mostrar el ID del producto en la consola
    console.log("Código del producto a eliminar:", ProductId);  // ProductId es el código del producto

    // Realizar la petición al backend para eliminar el producto
    const payload = { codigo_producto: ProductId };  // Asegúrate de enviar el ID correcto

    const response = await fetch("http://localhost:8080/Proton/backend/actions/deleteProduct.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Asegúrate de enviar JSON
      },
      body: JSON.stringify(payload), // Enviar el ID como JSON
    });

    const result = await response.json(); // Esperar la respuesta en formato JSON

    if (result.success) {
      alert(result.message);
      // Recargar la página para actualizar la lista de productos
      window.location.reload();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    alert("Error al eliminar el producto.");
  }
};


  return (
    <div className="card" style={{ borderRadius: "0%" }}>
      <div className="card-image" style={{ borderRadius: "0%" }}>
        <figure className="image is-4by3">
          <img
            src={ProductImage || "https://bulma.io/assets/images/placeholders/1280x960.png"}
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
            <button className="buttonImage delete-button" onClick={handleDeleteClick}>
              <img
                src={require("../../assets/images/delete.png")}
                alt="DeleteButton"
                style={{ fill: "black", color: "white" }}
              />
            </button>
          )}
          {ShowModifyButton && (
            <button className="buttonImage modify-button" onClick={handleUpdateClick}>
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
        <p className="product-name" style={{ fontWeight: "bold" }}>{ProductName}</p>
        <p className="product-price" style={{ color: "gray" }}>${ProductPrice}</p>
      </div>
    </div>
  );
};

export default ProductCard;
