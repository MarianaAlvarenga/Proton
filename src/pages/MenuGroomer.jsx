import React from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import NavBar from "../components/common/NavBar";

const MenuGroomer = () => {
    const navigate = useNavigate(); // Obtener la función navigate

    // Función para manejar el clic en "Disponibilidad"
    const handleDisponibilidadClick = () => {
        navigate("/Shifts", { 
            state: { 
              showUserTypeSelector: false,
              userRole: 3 // O obténlo del localStorage
            } 
          });
    };

    // Función para manejar el clic en "Agendar turno"
    const handleAgendarTurnoClick = () => {
        navigate("/Shifts"); // Mostrar UserTypeSelector (por defecto)
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
                <NavBar></NavBar>
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
                        <a role="button" onClick={handleDisponibilidadClick}> {/* Botón Disponibilidad */}
                            <img
                                src={require("../../src/assets/images/disponibilidad.png")}
                                alt="Disponibilidad"
                                style={{ width: "5em" }}
                            />
                            <h2 className="title is-2">Disponibilidad</h2>
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
                        <a role="button" onClick={handleAgendarTurnoClick}> {/* Botón Agendar turno */}
                            <img
                                src={require("../../src/assets/images/agenda.png")}
                                alt="Agenda"
                                style={{ width: "5em" }}
                            />
                            <h2 className="title is-2">Agendar turno</h2>
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MenuGroomer;