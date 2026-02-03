import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/common/NavBar";
import Carousel from "../components/common/Carousel";
import { useWindowSize } from "../Hooks/useWindowSize";
import SubNavBar from "../components/common/SubNavBar";

import "./MenuAdmin.css";

const MenuAdmin = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize(); // Hook para obtener el tamaño de la ventana
  const isMobile = width < 768; // Determinamos si es móvil (si el ancho es menor que 768px)

  
  const handleAgendarTurnoClick = () => {
    navigate("/Shifts", {
      state: {
        userRole: 4,
        isSettingAvailability: false,
        isAgendarTurno: true,
        mode: "agendar",
      },
    });
  };
  
  const handleVentasClick = () => {
    navigate("/Products");
  };

  const handleUsersClick = () => {
    navigate("/UsersAdmin");
  };
  
  const handleServicesClick = () => {
    navigate("/Services");
  };
  const links = [
    { label: "Agendar turno", icon: "agenda.png", onClick: handleAgendarTurnoClick},
    { label: "Ventas", path: "/Products", icon: "ventas.png", onClick: handleVentasClick},
    { label: "Usuarios", path: "/UsersAdmin", icon: "usuarios.png", onClick: handleUsersClick },
    { label: "Servicios", path: "/Services", icon: "services.png", onClick: handleServicesClick },

  ];
  return (
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
      {/* Navbar principal */}
      <NavBar/>

      {/* Mostrar contenido según el modo */}
      {!isMobile ? (
        // Vista para pantallas grandes
        <>
          <SubNavBar
            links={links.map(link => ({
              label: link.label,
              path: "#",
              icon: link.icon,
              onClick: link.onClick,
            }))}
          />
          <Carousel />
        </>
      ) : (
        // Vista para móviles
        <div
          className="columns is-mobile"
          style={{
            marginTop: "1em",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "3rem", // 👈 espacio para el footer
          }}
        >
          {links.map((link, index) => (
            <div
              key={index}
              className="column is-flex is-flex-direction-column is-justify-content-center is-align-items-center"
              style={{
                flex: 1,
                backgroundColor: "#EEE6FF",
                marginBottom: "1em",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <a
                role="button"
                onClick={() => {
                  if (link.onClick) {
                    // Si tiene una función personalizada (como Agendar turno)
                    link.onClick();
                  } else {
                    // Si tiene path normal
                    navigate(link.path, {
                      state: { mode: link.mode || "", userRole: 4 },
                    });
                  }
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={require(`../assets/images/${link.icon}`)}
                  alt={`${link.label}Icon`}
                  style={{ width: "5em", marginBottom: "1em" }}
                />
                <h2 className="title is-2">{link.label}</h2>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuAdmin;
