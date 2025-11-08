// MenuClient.jsx
import React from "react";
import NavBar from "../components/common/NavBar";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "../Hooks/useWindowSize";
import Carousel from "../components/common/Carousel";
import SubNavBar from "../components/common/SubNavBar";

const MenuClient = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // 🔹 Handlers con state explícito
  const handleAgendarTurnoClick = () => {
    navigate("/Shifts", {
      state: {
        userRole: 1, // o 2, según tu sistema
        isSettingAvailability: false,
        isAgendarTurno: true,
        mode: "agendar",
      },
    });
  };

  const handleVentasClick = () => {
    navigate("/Products");
  };

  // 🔹 Links para desktop
  const links = [
    { label: "Agendar turno", icon: "agenda.png", onClick: handleAgendarTurnoClick },
    { label: "Ventas", icon: "ventas.png", onClick: handleVentasClick },
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
      <NavBar />
      {!isMobile ? (
        <>
          {/* 🔹 Ahora SubNavBar usa los handlers definidos arriba */}
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
                borderRadius: "8px",
              }}
            >
              <a
                role="button"
                onClick={link.onClick}
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

export default MenuClient;
