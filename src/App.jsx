import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bulma-carousel/dist/css/bulma-carousel.min.css';

import Layout from '././components/common/Layout';

// Importa tus componentes
import Login from './pages/Login';
import SignUp from './components/common/SignUp';
import ProductsCreate from './components/sales/ProductsCreate';
import Products from './pages/Products';
import Shifts from './pages/Shifts';
import MenuClient from './pages/MenuClient';
import MenuGroomer from './pages/MenuGroomer';
import MenuAdmin from './pages/MenuAdmin';
import UsersAdmin from './pages/UsersAdmin';
import ProductCreateForm from './components/sales/ProductCreateForm';
import Alert from './components/common/Alert';
import Cart from './components/sales/Cart';
import UserSaleInfo from './components/sales/UserSaleInfo';
import ProfileUser from './components/common/ProfileUser';
import Landing from './pages/Landing';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/ProductsCreate" element={<ProductsCreate />} />
          <Route path="/Products" element={<Products />} />
          <Route path="/Shifts" element={<Shifts />} />
          <Route path="/MenuClient" element={<MenuClient />} />
          <Route path="/MenuGroomer" element={<MenuGroomer />} />
          <Route path="/MenuAdmin" element={<MenuAdmin />} />
          <Route path="/ProductCreateForm/:productId" element={<ProductCreateForm />} />
          <Route path="/UsersAdmin" element={<UsersAdmin />} />
          <Route path="/Alert" element={<Alert/>} />
          <Route path="/Cart" element={<Cart/>} />
          <Route path="/UserSaleInfo" element={<UserSaleInfo/>} />
          <Route path="/ProfileUser" element={<ProfileUser/>} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
