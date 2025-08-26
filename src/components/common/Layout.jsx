import { useLocation } from "react-router-dom";
import Footer from "../common/Footer";

const Layout = ({ children }) => {
  const location = useLocation();

  // Páginas donde no queremos footer (ej. login o signup)
  const hideFooterRoutes = ["/login", "/SignUp"];
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* children = el contenido de cada página, con sus NavBar propios */}
      <div style={{ flex: 1 }}>
        {children}
      </div>
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
