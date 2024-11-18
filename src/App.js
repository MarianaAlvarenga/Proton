import './App.css';
import Modal from './components/common/Modal';
import Login from './pages/Login';
import Menu from './components/common/Menu';
import SignUp from './components/common/SignUp';
import ProductsCreate from './components/sales/ProductsCreate.jsx';
import ProductsAdmin from './pages/Products.jsx';
import Shifts from './pages/Shifts.jsx';
import MenuClient from './pages/MenuClient.jsx';
import MenuGrommer from './pages/MenuGrommer.jsx';
function App() {
  return (
    <>
      <MenuGrommer></MenuGrommer>
    </>
  );
}

export default App;
