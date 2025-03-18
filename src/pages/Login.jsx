import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const checkUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Proton/backend/actions/getUserRole.php', {
          withCredentials: true,
        });

        if (response.data.success) {
          const { rol } = response.data.user;

          // Redirigir según el rol del usuario si ya está autenticado
          switch (parseInt(rol, 10)) {
            case 1:
              navigate('/MenuClient');
              break;
            case 2:
              navigate('/Products');
              break;
            case 3:
              navigate('/MenuGroomer');
              break;
            case 4:
              navigate('/MenuAdmin');
              break;
            default:
              setError('El usuario no tiene permisos válidos.');
              break;
          }
        }
      } catch (error) {
        console.error('No autenticado o error al verificar sesión:', error);
      }
    };

    checkUserRole();
  }, [navigate]);

  const handleRegisterClick = () => {
    navigate('/SignUp', { state: { showComboBox: false } }); // Enviamos la prop showComboBox como false
  };

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
            navigate('/Products');
            break;
          case 3:
            navigate('/MenuGroomer');
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
    <div className="login-container">
      <div
        className="box login-box"
        style={{
          backgroundColor: '#D9D0F0',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <figure className="image is-128x128 is-inline-block">
          <img
            className="is-rounded"
            src={require('../assets/images/protiblanco.png')}
            alt="Logo"
          />
        </figure>
        <h1 className="title is-3">Ingreso</h1>
        <form onSubmit={handleLogin} style={{ textAlign: 'left', width: '100%' }}>
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

        <p className="has-text-centered">o inicia sesión con:</p>
        <div className="buttons is-centered" style={{ marginTop: '1rem' }}>
          <button className="button is-light">
            <span className="icon">
              <i className="fab fa-google"></i>
            </span>
            <span>Google</span>
          </button>
          <button className="button is-light">
            <span className="icon">
              <i className="fab fa-facebook"></i>
            </span>
            <span>Facebook</span>
          </button>
        </div>

        <p className="has-text-centered">
          Si no tenés cuenta,{' '}
          <a role="button" onClick={handleRegisterClick}>
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
