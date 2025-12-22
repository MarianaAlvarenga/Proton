import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import Alert from "../common/Alert.jsx";

const ProductCard = ({
  ProductName = "Producto",
  ProductPrice = "0.00",
  ProductStock = 0,
  ProductReplenishment = 0,
  ListMode = false,
  ProductImage = "",
  ProductId,
  ShowAddButton = false,
  ShowDeleteButton = false,
  ShowModifyButton = false,
  ShowCount = false,
  isAdmin = false,
  cartProducts,
  setCartProducts = () => { },
  onCartChange = () => { },
}) => {

  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);

  const loadProductCount = useCallback(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const foundProduct = savedCart.find(p => p.id === ProductId);
    const newCount = foundProduct ? foundProduct.quantity : 0;
    setProductCount(newCount);
  }, [ProductId]);

  useEffect(() => {
    loadProductCount();
  }, [loadProductCount]);

  useEffect(() => {
    const handleCartUpdated = () => loadProductCount();
    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [ProductId, loadProductCount]);

  useEffect(() => {
    if (cartProducts && cartProducts.length >= 0) {
      loadProductCount();
    }
  }, [cartProducts, loadProductCount]);


  const updateCart = (cart) => {
    localStorage.setItem("cart", JSON.stringify(cart));

    if (typeof setCartProducts === "function") setCartProducts([...cart]);
    if (typeof onCartChange === "function") onCartChange([...cart]);

    const foundProduct = cart.find(p => p.id === ProductId);
    setProductCount(foundProduct ? foundProduct.quantity : 0);

    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleAddClick = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex((item) => item.id === ProductId);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({
        id: ProductId,
        name: ProductName,
        price: parseFloat(ProductPrice),
        image: ProductImage,
        quantity: 1,
        stock: ProductStock,                  // 🟢 agregado
        replenishment_point: ProductReplenishment // 🟢 agregado
      });
    }

    updateCart(cart);
    if (window.location.pathname !== "/Cart") navigate("/Cart");
  };

  const incrementCount = () => handleAddClick();

  const decrementCount = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex((item) => item.id === ProductId);

    if (existingProductIndex !== -1) {
      if (cart[existingProductIndex].quantity > 1) {
        cart[existingProductIndex].quantity -= 1;
      } else {
        cart.splice(existingProductIndex, 1);
      }
      updateCart(cart);
    }
  };

  const handleUpdateClick = () => navigate(`/ProductCreateForm/${ProductId}`);

  const handleDeleteClick = async () => {
    const result = await Alert({
      Title: "Eliminar producto",
      Detail: `¿Deseás eliminar "${ProductName}"?`,
      icon: "warning",
      Confirm: "Sí, eliminar",
      Cancel: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      const payload = { codigo_producto: ProductId };

      const response = await fetch(
        "https://cards-gamma-ocean-dale.trycloudflare.com/backend/actions/deleteProduct.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const resultData = await response.json();

      await Alert({
        Title: resultData.success ? "Éxito" : "Error",
        Detail: resultData.message,
        icon: resultData.success ? "success" : "error",
        Confirm: "Aceptar",
      });

      if (resultData.success) window.location.reload();

    } catch (error) {
      await Alert({
        Title: "Error",
        Detail: "No se pudo conectar con el servidor.",
        icon: "error",
        Confirm: "Aceptar",
      });
    }
  };


  return (
    <div className={`card ${ListMode ? "cardList" : ""}`}>
      <div className="card-image" style={{ borderRadius: "0%" }}>
        <figure className="image is-16by9">
          <img
            src={ProductImage || "https://bulma.io/assets/images/placeholders/640x360.png"}
            alt="Product"
            style={{ borderRadius: "0%" }}
          />

          {ShowAddButton && ProductStock > 0 && (
            <button className="buttonImage add-button" onClick={handleAddClick}>
              <img src={require("../../assets/images/agregar.png")} alt="AddButton" />
            </button>
          )}

          {ShowDeleteButton && (
            <button className="buttonImage delete-button" onClick={handleDeleteClick}>
              <img src={require("../../assets/images/delete.png")} alt="DeleteButton" />
            </button>
          )}

          {ShowModifyButton && (
            <button className="buttonImage modify-button" onClick={handleUpdateClick}>
              <img src={require("../../assets/images/modify.png")} alt="ModifyButton" />
            </button>
          )}
        </figure>
      </div>

      <p className="product-name" style={{ fontWeight: "bold" }}>{ProductName}</p>

      {isAdmin
        && Number(ProductStock) > 0
        && Number(ProductStock) < Number(ProductReplenishment) && (
          <p style={{ color: "red", fontWeight: "bold", marginTop: "6px" }}>
            REPOSICIÓN NECESARIA (Stock: {ProductStock})
          </p>
        )}


      <div className="card-content">
        {ProductStock > 0 ? (
          <p className="product-price" style={{ color: "gray" }}>${ProductPrice}</p>
        ) : (
          <p className="product-price" style={{ color: "red", fontWeight: "bold" }}>
            AGOTADO
          </p>
        )}


        {ShowCount && ProductStock > 0 && (
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
