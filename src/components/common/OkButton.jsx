import React from "react";
import { useNavigate } from "react-router-dom";

const OkButton = ({ NameButton = "Agregar", cartProducts = [], clearCart, isRegistered, email }) => {
    const navigate = useNavigate();

    const handleClick = async () => {
        if (NameButton === "Finalizar compra") {
            try {
                // Enviar los datos al backend
                const response = await fetch("http://localhost:8080/Proton/backend/actions/completePurchase.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cart: cartProducts, // Productos del carrito
                        isRegistered, // Estado del checkbox (usuario registrado o no)
                        email, // Correo electrónico (si el usuario está registrado)
                    }),
                });

                const result = await response.json();
                console.log(result); // Verifica lo que recibes como respuesta

                if (result.success) {
                    alert("Compra realizada con éxito");
                    clearCart(); // Vacía el carrito
                    navigate("/Products"); // Redirige a la página de productos
                } else {
                    alert("Error al procesar la compra: " + result.message);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error al procesar la compra. Intenta nuevamente.");
            }
        }
    };

    return (
        <div style={{ width: "50%", display: "flex", justifyContent: "center", margin: 0 }}>
            <button
                className="button is-fullwidth"
                style={{ backgroundColor: "#6A0DAD", color: "white" }}
                onClick={handleClick}
            >
                {NameButton}
            </button>
        </div>
    );
};

export default OkButton;