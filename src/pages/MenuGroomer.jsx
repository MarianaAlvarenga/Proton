import React from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import NavBar from "../components/common/NavBar";
import { useWindowSize } from "../Hooks/useWindowSize";
import Carousel from "../components/common/Carousel";
import SubNavBar from "../components/common/SubNavBar";

const MenuGroomer = () => {
    const navigate = useNavigate(); // Obtener la función navigate
    const { width } = useWindowSize(); // Hook para obtener el tamaño de la ventana
    const isMobile = width < 768; 

    const links = [
        { label: "Disponibilidad", path: "/Shifts", icon: "disponibilidad.png" },
        { label: "Calendario", path: "/Products", icon: "agenda.png" },
        { label: "Asistencia", path: "#", icon: "agenda.png" },
    ];  
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
                    width: "100%",
                    maxWidth: "100%",
                    margin: "0 auto",
                    height: "100vh",
                    textAlign: "center",
                    backgroundColor: "white",
                }}
            >
                <NavBar></NavBar>
                {!isMobile ? (
                    // Vista para pantallas grandes
                    <>
                        <SubNavBar links={links} />
                        <Carousel />
                    </>
                ) : (
                    <div
                        className="columns is-movile"
                        style={{
                            marginTop: "1em",
                            height: "100vh",
                            display: "flex",
                            flexDirection: "column",
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
                                marginBottom: "1em",
                                borderRadius: "8px", // Bordes redondeados para estética
                            }}
                        >
                            <a role="button is-medium is-fullwidth" onClick={handleAgendarTurnoClick}> {/* Botón Agendar turno */}
                                <img
                                    src={require("../../src/assets/images/agenda.png")}
                                    alt="Agenda"
                                    style={{ width: "5em" }}
                                />
                                <h2 className="title is-2">Agendar turno</h2>
                            </a>
                        </div>

                        <div
                            className="column is-full is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
                            style={{
                                height: "calc(50% - 1em)", // Altura ajustada para margen interno
                                backgroundColor: "#EEE6FF",
                                borderRadius: "8px", // Bordes redondeados para estética
                                marginBottom: "1em",
                            }}
                        >
                            <a role="button is-medium is-fullwidth" onClick={handleAgendarTurnoClick}> {/* Botón Agendar turno */}
                                <img
                                    src={require("../../src/assets/images/lista-de-verificacion.png")}
                                    alt="Verificacion"
                                    style={{ width: "5em" }}
                                />
                                <h2 className="title is-2">Asistencia</h2>
                            </a>
                        </div>
                    </div>
                    )}
            </div>
        </>
    );
};

export default MenuGroomer;