// MenuClient.jsx
import React from "react";
import NavBar from "../components/common/NavBar";
import { useNavigate } from "react-router-dom";  // Importa useNavigate

const MenuClient = () => {

  const navigate = useNavigate();  // Inicializa el hook de navegación
  const userRole = localStorage.getItem('userRole'); // Obtén el rol desde localStorage
  
  const handleSalesClick = () => {
    navigate("/Products", { state: { role: userRole } });
  };

    // Función para manejar el clic en "Ventas"
  const handleShiftsClick = () => {
      navigate("/Shifts", { state: { role: userRole } });
  };
  
  
  return (
    <>
      <div
        className="container"
        style={{
          maxWidth: "400px",
          height: "100vh",
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <NavBar showMenu />
        <div
          className="columns is-multiline"
          style={{
            height: "calc(100% - 4em)", // Ajusta el espacio restante restando el tamaño del NavBar
            padding: "1em",
          }}
        >
          <div
            className="column is-full is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
            style={{
              height: "calc(50% - 1em)", // Altura ajustada para margen interno
              marginBottom: "1em",
              backgroundColor: "#EEE6FF",
              borderRadius: "8px", // Bordes redondeados para estética
            }}
          >
            <a role="button" onClick={handleShiftsClick}>
              <img
                src={require("../../src/assets/images/peluqueria.png")}
                alt="shiftsIcon"
                style={{ width: "5em" }}
              />
              <h2 className="title is-2">Turnos</h2>
            </a>
          </div>

          <div
            className="column is-full is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
            style={{
              height: "calc(50% - 1em)", // Altura ajustada para margen interno
              backgroundColor: "#EEE6FF",
              borderRadius: "8px", // Bordes redondeados para estética
            }}
          >
            <a role="button" onClick={handleSalesClick}>
              <img
                src={require("../../src/assets/images/ventas.png")}
                alt="salesIcon"
                style={{ width: "5em" }}
              />
              <h2 className="title is-2">Ventas</h2>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuClient;
