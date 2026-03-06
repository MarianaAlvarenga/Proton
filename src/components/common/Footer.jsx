import {
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaPinterest,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const iconStyle = {
    margin: "0 10px",
    color: "white",
    transition: "transform 0.3s ease",
  };

  return (
    <footer className="footer" style={{ backgroundColor: "#9655C5", color: "white" }}>
      <div className="content has-text-centered">
        {/* Íconos redes sociales */}
        <div style={{ marginBottom: "1rem" }}>
          {[
            { Icon: FaLinkedin, url: "https://www.linkedin.com" },
            { Icon: FaYoutube, url: "https://www.youtube.com" },
            { Icon: FaFacebook, url: "https://www.facebook.com" },
            { Icon: FaPinterest, url: "https://www.pinterest.com" },
            { Icon: FaTwitter, url: "https://x.com" },
            { Icon: FaInstagram, url: "https://www.instagram.com" },
          ].map(({ Icon, url }, i) => (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="icon"
              style={iconStyle}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Icon size={24} />
            </a>
          ))}
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
