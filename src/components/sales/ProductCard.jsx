import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import Alert from "../common/Alert.jsx"; // 👈 NUEVO

const ProductCard = ({
  ProductName = "Producto",
  ProductPrice = "0.00",
  ListMode = false,
  ProductImage = "",
  ProductId,
  ShowAddButton = false,
  ShowDeleteButton = false,
  ShowModifyButton = false,
  ShowCount = false,
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
    console.log(`🔄 Producto ${ProductId} - cantidad cargada: ${newCount}`);
  }, [ProductId]);

  useEffect(() => {
    loadProductCount();
  }, [loadProductCount]);

  useEffect(() => {
    const handleCartUpdated = () => {
      console.log(`📢 Evento recibido para producto ${ProductId}`);
      loadProductCount();
    };

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

    if (typeof setCartProducts === "function") {
      setCartProducts([...cart]);
    }

    if (typeof onCartChange === "function") {
      onCartChange([...cart]);
    }

    const foundProduct = cart.find(p => p.id === ProductId);
    const newCount = foundProduct ? foundProduct.quantity : 0;
    setProductCount(newCount);

    window.dispatchEvent(new Event("cartUpdated"));
    console.log("🛒 Carrito actualizado:", cart);
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
      });
    }

    updateCart(cart);

    if (window.location.pathname !== "/Cart") {
      navigate("/Cart");
    }
  };

  const incrementCount = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find((item) => item.id === ProductId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.push({
        id: ProductId,
        name: ProductName,
        price: parseFloat(ProductPrice),
        image: ProductImage,
        quantity: 1,
      });
    }

    updateCart(cart);
  };

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

  const handleUpdateClick = () => {
    navigate(`/ProductCreateForm/${ProductId}`);
  };


  // 🔥 REEMPLAZADO CON ALERT
  const handleDeleteClick = async () => {
    
    // 1️⃣ Modal de confirmación
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
        "https://korea-scenes-slot-tattoo.trycloudflare.com/backend/actions/deleteProduct.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const resultData = await response.json();

      // 2️⃣ Mostrar modal final según respuesta
      await Alert({
        Title: resultData.success ? "Éxito" : "Error",
        Detail: resultData.message,
        icon: resultData.success ? "success" : "error",
        Confirm: "Aceptar",
      });

      // 3️⃣ Si ok → recargar
      if (resultData.success) {
        window.location.reload();
      }

    } catch (error) {
      console.error("Error al eliminar:", error);

      await Alert({
        Title: "Error",
        Detail: "No se pudo conectar con el servidor.",
        icon: "error",
        Confirm: "Aceptar",
      });
    }
  };

  console.log(`🎨 RENDER Producto ${ProductId} - cantidad: ${productCount}`);

  return (
    <div className={`card ${ListMode ? "cardList" : ""}`}>
      <div className="card-image" style={{ borderRadius: "0%" }}>
        <figure className="image is-16by9">
          <img
            src={ProductImage || "https://bulma.io/assets/images/placeholders/640x360.png"}
            alt="Product"
            style={{ borderRadius: "0%" }}
          />

          {ShowAddButton && (
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

      <div className="card-content">
        <p className="product-price" style={{ color: "gray" }}>${ProductPrice}</p>

        {ShowCount && (
          <div className="product-counter">
            <button className="counter-button" onClick={incrementCount}>+</button>
            <span className="counter-value">{productCount}</span>
            <button className="counter-button" onClick={decrementCount}>-</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
