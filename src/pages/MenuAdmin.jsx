import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import Carousel from "../components/common/Carousel";
import { useWindowSize } from "../Hooks/useWindowSize";
import './MenuAdmin.css';

const MenuAdmin = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize(); // Hook para obtener el tamaño de la ventana
  const isMobile = width < 768; // Determinamos si es móvil (si el ancho es menor que 768px)

  const handleSalesClick = () => {
    const userRole = localStorage.getItem("userRole");
    navigate("/Products", { state: { role: userRole } });
  };

  const handleShiftsClick = () => {
    navigate("/Shifts");
  };

  const handleUsersClick = () => {
    navigate("/Users");
  };



  return (
    <div className="container" style={{ width: "100%", maxWidth: "100%", margin: "0 auto", height: "100vh", textAlign: "center", backgroundColor: "white" }}>
      <NavBar showMenu />
      
      {/* Mostrar el carrusel solo en pantallas grandes */}
      {!isMobile && <Carousel />}
      
      {/* Menú visible solo en pantallas móviles */}
      {isMobile && (
        <div className="columns" style={{ marginTop: "1em", height: "100vh", display: "flex", flexDirection: "column" }}>
          <div className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center" style={{ flex: 1, backgroundColor: "#EEE6FF", marginBottom: "1em", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <a role="button" onClick={handleShiftsClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <img src={require("../assets/images/peluqueria.png")} alt="shiftsIcon" style={{ width: "5em", marginBottom: "1em" }} />
              <h2 className="title is-2">Turnos</h2>
            </a>
          </div>

          <div className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center" style={{ flex: 1, backgroundColor: "#EEE6FF", marginBottom: "1em", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <a role="button" onClick={handleSalesClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <img src={require("../assets/images/ventas.png")} alt="salesIcon" style={{ width: "5em", marginBottom: "1em" }} />
              <h2 className="title is-2">Ventas</h2>
            </a>
          </div>

          <div className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center" style={{ flex: 1, backgroundColor: "#EEE6FF", marginBottom: "1em", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <a role="button" onClick={handleUsersClick} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <img src={require("../assets/images/usuarios.png")} alt="usersIcon" style={{ width: "5em", marginBottom: "1em" }} />
              <h2 className="title is-2">Usuarios</h2>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuAdmin;
