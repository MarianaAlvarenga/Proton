import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleRegisterClick = () => {
    navigate("/SignUp");
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reinicia el estado de error al enviar
  

    try {
      const response = await axios.post('http://localhost:8080/Proton/backend/actions/auth-chatsito.php', {
        action: 'login',
        email,
        contrasenia: password,
      });

      if (response.data.success) {
        const { rol, nombre } = response.data.user;

        // Almacenar datos relevantes en localStorage
        localStorage.setItem('userRole', rol);
        localStorage.setItem('userName', nombre);

        // Redirigir según el rol del usuario
        switch (parseInt(rol, 10)) {
          case 1:
            navigate('/MenuClient');
            break;
          case 2:
            navigate('/MenuSeller');
            break;
          case 3:
            navigate('/MenuGrommer');
            break;
          case 4:
            navigate('/MenuAdmin');
            break;
          default:
            setError('El usuario no tiene permisos válidos.');
            break;
        }
      } else {
        setError(response.data.message || 'Error desconocido.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
      <div
        className="box"
        style={{
          backgroundColor: '#D9D0F0',
          borderRadius: '10px',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <figure className="image is-128x128 is-inline-block">
          <img
            className="is-rounded"
            src={require('../assets/images/protiblanco.png')}
            alt="Logo"
            style={{ margin: '0 auto' }}
          />
        </figure>
        <h1 className="title is-3">Ingreso</h1>
        <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
          <div className="field">
            <label className="label">Email</label>
            <div className="control">
              <input
                className="input"
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="field">
            <label className="label">Contraseña</label>
            <div className="control">
              <input
                className="input"
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && <p className="help is-danger">{error}</p>}
          <div className="field">
            <button className="button is-fullwidth" style={{ backgroundColor: '#6A0DAD', color: 'white' }}>
              Ingresar
            </button>
          </div>
        </form>
        <p className="has-text-centered">
          Si no tenés cuenta, <a role="button" onClick={handleRegisterClick}>Regístrate</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
