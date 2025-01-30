import React from "react";    
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const CancelButton = ({ NameButton = "Cancelar", clearCart, className }) => {
    
    const navigate = useNavigate(); // Inicializa useNavigate
    
    const handleClick = () => {
        if (className === "cancel-button") {
            if (clearCart) {
                localStorage.removeItem("cart"); // Vacía el carrito en localStorage
                clearCart(); // Actualiza el estado del carrito en React
            }
            const userRole = localStorage.getItem('userRole'); // Obtén el rol desde localStorage
            navigate("/Products", { state: { role: userRole } });
        } else if (className === "button") {
            navigate("/Products"); // Redirige a /UserSaleInfo
        } else if (className === "end-button") {
            navigate("/UserSaleInfo"); // Redirige a /UserSaleInfo
        }
    };

    return (
        <div style={{ width: "50%", display: "flex", justifyContent: "center", margin: 0 }}>
            <button
                className="button is-fullwidth"
                style={{ backgroundColor: "#6A0DAD", color: "white" }} // 🔹 Ambos botones tienen el mismo estilo
                onClick={handleClick}
            >
                {NameButton}
            </button>
        </div>
    );
};

export default CancelButton;
