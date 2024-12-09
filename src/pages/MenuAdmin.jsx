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

  const links = [
    { label: "Turnos", path: "/Shifts", icon: "peluqueria.png" },
    { label: "Ventas", path: "/Products", icon: "ventas.png" },
    { label: "Usuarios", path: "/Users", icon: "usuarios.png" },
  ];

  return (
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
      {/* Navbar principal */}
      <NavBar showMenu />

      {/* Mostrar contenido según el modo */}
      {!isMobile ? (
        // Vista para pantallas grandes
        <>
          <SubNavBar links={links} />
          <Carousel />
        </>
      ) : (
        // Vista para móviles
        <div
          className="columns is-mobile"
          style={{
            marginTop: "1em",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
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
                onClick={() => navigate(link.path)}
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
