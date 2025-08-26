import { FaLinkedin, FaYoutube, FaFacebook, FaPinterest, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer" style={{ backgroundColor: "#9655C5", color: "white" }}>
      <div className="content has-text-centered">

        {/* Íconos redes sociales */}
        <div style={{ marginBottom: "1rem" }}>
          <a href="#" className="icon" style={{ margin: "0 10px", color: "white" }}>
            <FaLinkedin size={24} />
          </a>
          <a href="#" className="icon" style={{ margin: "0 10px", color: "white" }}>
            <FaYoutube size={24} />
          </a>
          <a href="#" className="icon" style={{ margin: "0 10px", color: "white" }}>
            <FaFacebook size={24} />
          </a>
          <a href="#" className="icon" style={{ margin: "0 10px", color: "white" }}>
            <FaPinterest size={24} />
          </a>
          <a href="#" className="icon" style={{ margin: "0 10px", color: "white" }}>
            <FaTwitter size={24} />
          </a>
          <a href="#" className="icon" style={{ margin: "0 10px", color: "white" }}>
            <FaInstagram size={24} />
          </a>
        </div>

        {/* Texto principal */}
        <p style={{ fontWeight: "600" }}>
          Estamos en Buenos Aires, Argentina.  
          <br />
          ¡Trabajamos con clientes de todas partes!
        </p>

        {/* Contacto */}
        <div style={{ marginTop: "1rem" }}>
          <p>
            <span style={{ color: "#FFD700" }}>📧 contacto@proton.com</span> | 📞 (011) 1234-5678
          </p>
          <p>
            <strong>Proton</strong> - Calle Falsa 123, Buenos Aires
          </p>
        </div>

        {/* Derechos */}
        <p style={{ fontSize: "0.9rem", marginTop: "1rem", color: "#e0c8f7" }}>
          © 2025 Proton. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
