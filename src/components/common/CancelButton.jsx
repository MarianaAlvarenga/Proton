import React from "react";    
import { useNavigate } from "react-router-dom"; // Importar useNavigate

const CancelButton = ({ NameButton = "Cancelar", clearCart }) => {
    
    const navigate = useNavigate(); // Inicializa useNavigate
    
    const handleCancelClick = () => {
        if (clearCart) {
            localStorage.removeItem("cart"); // Vacía el carrito en localStorage
            clearCart(); // Actualiza el estado del carrito en React
        }
        const userRole = localStorage.getItem('userRole'); // Obtén el rol desde localStorage
        navigate("/Products", { state: { role: userRole } });
    };

    return (
        <div style={{ width: "50%", display: "flex", justifyContent: "center", margin: 0 }}>
            <button
                className="button is-fullwidth"
                style={{ backgroundColor: "#6A0DAD", color: "white" }}
                onClick={handleCancelClick}
            >
                {NameButton}
            </button>
        </div>
    );
};

export default CancelButton;
