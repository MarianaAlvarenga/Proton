import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

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

  // 🔹 Función para cargar la cantidad - useCallback para evitar recreación
  const loadProductCount = useCallback(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const foundProduct = savedCart.find(p => p.id === ProductId);
    const newCount = foundProduct ? foundProduct.quantity : 0;
    setProductCount(newCount);
    console.log(`🔄 Producto ${ProductId} - cantidad cargada: ${newCount}`);
  }, [ProductId]);

  // 🔹 Carga inicial al montar
  useEffect(() => {
    loadProductCount();
  }, [loadProductCount]);

  // 🔹 Escuchar cambios globales del carrito
  useEffect(() => {
    const handleCartUpdated = () => {
      console.log(`📢 Evento recibido para producto ${ProductId}`);
      loadProductCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, [ProductId, loadProductCount]);

  // 🔹 También escuchar cambios de cartProducts si viene del padre
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

    // 🔹 FORZAR actualización inmediata
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

  const handleDeleteClick = async () => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el producto "${ProductName}"?`
    );
    if (!confirmDelete) return;

    try {
      console.log("Código del producto a eliminar:", ProductId);
      const payload = { codigo_producto: ProductId };

      const response = await fetch(
        "https://favourites-roof-lone-welcome.trycloudflare.com/backend/actions/deleteProduct.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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

  // 🔹 Agregar console.log en el render para debug
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