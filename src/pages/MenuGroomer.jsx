import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import { useWindowSize } from "../Hooks/useWindowSize";
import Carousel from "../components/common/Carousel";
import SubNavBar from "../components/common/SubNavBar";

const MenuGroomer = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const handleAgendarTurnoClick = () => {
    navigate("/Shifts", {
      state: {
        userRole: 3,
        isSettingAvailability: false,
        isAgendarTurno: true,
        mode: "agendar",
      },
    });
  };

  const handleDisponibilidadClick = () => {
    navigate("/Shifts", {
      state: {
        userRole: 3,
        isSettingAvailability: true,
        isAgendarTurno: false,
        mode: "disponibilidad",
      },
    });
  };

  // ✅ NUEVO: asistencia
  const handleAsistenciaClick = () => {
    navigate("/Shifts", {
      state: {
        userRole: 3,
        mode: "asistencia",
      },
    });
  };

  const links = [
    { label: "Disponibilidad", path: "/Shifts", icon: "disponibilidad.png", onClick: handleDisponibilidadClick },
    { label: "Agendar turno", path: "/Shifts", icon: "agenda.png", onClick: handleAgendarTurnoClick },
    { label: "Asistencia", path: "/Shifts", icon: "agenda.png", onClick: handleAsistenciaClick },
  ];

  return (
    <>
      <div
        className="container"
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          minHeight: "100vh",   // ✅
          textAlign: "center",
          backgroundColor: "white",
        }}
      >
        <NavBar />
        {!isMobile ? (
          <>
            <SubNavBar links={links} />
            <Carousel />
          </>
        ) : (
          <div
            className="columns is-mobile"
            style={{
              marginTop: "1em",
              display: "flex",
              flexDirection: "column",
              paddingBottom: "3rem",
            }}
          >
            <div className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
              style={{                 
                  flex: 1,
                  backgroundColor: "#EEE6FF",
                  marginBottom: "1em",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
              <a role="button" onClick={handleDisponibilidadClick}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <img src={require("../../src/assets/images/disponibilidad.png")} alt="Disponibilidad" style={{ width: "5em" }} />
                <h2 className="title is-2">Disponibilidad</h2>
              </a>
            </div>

            <div className="column is-full is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
              style={{ height: "calc(50% - 1em)", backgroundColor: "#EEE6FF", marginBottom: "1em", borderRadius: "8px" }}>
              <a role="button" onClick={handleAgendarTurnoClick}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <img src={require("../../src/assets/images/agenda.png")} alt="Agenda" style={{ width: "5em" }} />
                <h2 className="title is-2">Agendar turno</h2>
              </a>
            </div>

            <div className="column is-full is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
              style={{ height: "calc(50% - 1em)", backgroundColor: "#EEE6FF", borderRadius: "8px", marginBottom: "1em" }}>
              <a role="button" onClick={handleAsistenciaClick}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <img src={require("../../src/assets/images/lista-de-verificacion.png")} alt="Verificacion" style={{ width: "5em" }} />
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
