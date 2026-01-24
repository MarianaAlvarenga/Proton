import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <section
      className="hero is-fullheight is-light"
      style={{ backgroundColor: "#f5f3ff" }}
    >
      <div className="hero-body">
        <div className="container">

          <div className="columns is-vcentered landing-columns">

            {/* Imagen */}
            <div className="column landing-image-col">
              <figure className="image">
                <img
                  src={require("../assets/images/landing-dog.png")}
                  alt="Perro feliz"
                  className="landing-image"
                />
              </figure>
            </div>

            {/* Contenido */}
            <div className="column landing-content-col">
              <div className="box landing-box">

                <h1 className="title is-3 has-text-weight-bold landing-title">
                  Con <span>Protón todo es más fácil</span>
                </h1>

                <p className="subtitle is-5 landing-subtitle mb-5">
                  Gestioná turnos, controlá tus mascotas y comprá productos
                  para tu amigo peludo.
                </p>

                <div className="buttons landing-buttons">
                  <Link
                    to="/SignUp"
                    className="button is-primary is-medium"
                    style={{ backgroundColor: "#7C3AED", border: "none" }}
                  >
                    Registrarse
                  </Link>

                  <Link
                    to="/login"
                    className="button is-light is-medium"
                  >
                    Iniciar sesión
                  </Link>
                </div>

                {/* WhatsApp */}
                <div className="has-text-centered mt-5">
                  <a
                    href="https://wa.me/3513175777"
                    className="button is-success is-light is-rounded is-small"
                  >
                    <span className="icon">
                      <i className="fab fa-whatsapp"></i>
                    </span>
                    <span>Consultas: 351 317-5777</span>
                  </a>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
