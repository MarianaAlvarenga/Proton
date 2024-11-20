import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes
import Login from './pages/Login';
import SignUp from './components/common/SignUp';
import ProductsCreate from './components/sales/ProductsCreate';
import ProductsAdmin from './pages/Products';
import Shifts from './pages/Shifts';
import MenuClient from './pages/MenuClient';
import MenuGrommer from './pages/MenuGrommer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define las rutas para cada componente */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/products-create" element={<ProductsCreate />} />
        <Route path="/products-admin" element={<ProductsAdmin />} />
        <Route path="/shifts" element={<Shifts />} />
        <Route path="/MenuClient" element={<MenuClient />} />
        <Route path="/menu-grommer" element={<MenuGrommer />} />
      </Routes>
    </Router>
  );
}

export default App;
