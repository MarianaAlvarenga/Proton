import React from "react";
import { useNavigate } from "react-router-dom";  // Importa useNavigate
import NavBar from "../components/common/NavBar";

const MenuAdmin = () => {
  const navigate = useNavigate();  // Inicializa la función de navegación

  // Función para manejar el clic en "Turnos"
  const handleShiftsClick = () => {
    navigate("/Shifts");  // Redirige a la ruta de Turnos
  };

  const handleSalesClick = () => {
    navigate("/ProductsAdmin");
  }

  return (
    <>
      <div
        className="container"
        style={{ maxWidth: "400px", height: "100vh", textAlign: "center", backgroundColor: "white" }}
      >
        <NavBar showMenu />
        <div className="columns" style={{ margin: "1em" }}>
          <div
            className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
            style={{ height: "11em", backgroundColor: "#EEE6FF", marginBottom: "1em" }}
          >
            <a role="button" onClick={handleShiftsClick}> {/* Asocia la función al clic */}
              <img
                src={require("../assets/images/peluqueria.png")}
                alt="shiftsIcon"
                style={{ width: "5em" }}
              />
              <h2 className="title is-2">Turnos</h2>
            </a>
          </div>

          <div
            className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
            style={{ height: "11em", backgroundColor: "#EEE6FF", marginBottom: "1em" }}
          >
            <a role="button" onClick={handleSalesClick}>
              <img
                src={require("../assets/images/ventas.png")}
                alt="salesIcon"
                style={{ width: "5em" }}
              />
              <h2 className="title is-2">Ventas</h2>
            </a>
          </div>

          <div
            className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
            style={{ height: "11em", backgroundColor: "#EEE6FF", marginBottom: "1em" }}
          >
            <a role="button">
              <img
                src={require("../assets/images/usuarios.png")}
                alt="usersIcon"
                style={{ width: "5em" }}
              />
              <h2 className="title is-2">Usuarios</h2>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuAdmin;
