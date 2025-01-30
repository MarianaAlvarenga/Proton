import React from "react";
import { useNavigate } from "react-router-dom";

const OkButton = ({ NameButton = "Agregar", cartProducts = [], clearCart }) => {
    const navigate = useNavigate();

    const handleClick = async () => {
        if (NameButton === "Finalizar compra") {
            alert("Compra realizada con éxito");

            try {
                const response = await fetch("http://localhost:8080/Proton/backend/actions/completePurchase.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ cart: cartProducts }),
                });

                const result = await response.json();
                console.log(result); // Verifica lo que recibes como respuesta
                if (result.success) {
                    clearCart(); // Vacía el carrito
                    navigate("/Products"); // Redirige a la página de productos
                } else {
                    alert("Error al procesar la compra: " + result.message);
                }
            } catch (error) {
                console.error("Error:", error);
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
