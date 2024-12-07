import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importa tus componentes
import Login from './pages/Login';
import SignUp from './components/common/SignUp';
import ProductsCreate from './components/sales/ProductsCreate';
import Products from './pages/Products';
import Shifts from './pages/Shifts';
import MenuClient from './pages/MenuClient';
import MenuGrommer from './pages/MenuGrommer';
import MenuAdmin from './pages/MenuAdmin';
import UsersAdmin from './pages/UsersAdmin';
import ProductCreateForm from './components/sales/ProductCreateForm';
function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ProductsCreate" element={<ProductsCreate />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Shifts" element={<Shifts />} />
          <Route path="/MenuClient" element={<MenuClient />} />
          <Route path="/MenuGroomer" element={<MenuGrommer />} />
          <Route path="/MenuAdmin" element={<MenuAdmin />} />
          <Route path="/ProductCreateForm/:productId" element={<ProductCreateForm />} />
          <Route path="/Users" element={<UsersAdmin />} />
        </Routes>
      </Router>
  );
}

export default App;
