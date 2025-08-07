import React from "react";
import { Link } from "react-router-dom";
import "bulma/css/bulma.min.css";

const Landing = () => {
  return (
    <section className="hero is-fullheight is-light" style={{ backgroundColor: "#f5f3ff" }}>
      <div className="hero-body">
        <div className="container">
          <div className="columns is-vcentered is-variable is-8">
            
            {/* Imagen del perrito */}
            <div className="column is-half has-text-centered">
              <figure className="image is-4by3">
                <img
                  src={require('../assets/images/landing-dog.png')}
                  alt="Perro feliz"
                  style={{ borderRadius: "20px", boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
                />
              </figure>
            </div>

            {/* Contenido de bienvenida */}
            <div className="column is-half">
              <div className="box" style={{ borderRadius: "20px" }}>
                <h1 className="title is-3 has-text-weight-bold has-text-centered" style={{ color: "#7C3AED" }}>
                  Bienvenido a <span style={{ color: "#A78BFA" }}>Patitas Felices</span>
                </h1>
                <p className="subtitle is-5 has-text-centered mb-5">
                  Gestioná turnos, controlá tus mascotas y comprá productos para tu amigo peludo.
                </p>

                <div className="buttons is-centered">
                  <Link to="/SignUp" className="button is-primary is-rounded is-medium" style={{ backgroundColor: "#7C3AED", border: "none" }}>
                    Registrarse
                  </Link>
                  <Link to="/login" className="button is-light is-rounded is-medium">
                    Iniciar sesión
                  </Link>
                </div>

                {/* Extra opcional: Contacto por WhatsApp */}
                <div className="has-text-centered mt-5">
                  <a href="https://wa.me/3513175777" className="button is-success is-light is-rounded is-small">
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
