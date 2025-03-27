import React from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from '../components/common/Calendar';
import NavBar from '../components/common/NavBar';
import SubNavBar from '../components/common/SubNavBar';
import UserTypeSelector from '../components/common/UserTypeSelector';
import axios from 'axios';

const Shifts = () => {
  const location = useLocation();
  const showUserTypeSelector = location.state?.showUserTypeSelector ?? true;
  
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = user.rol || location.state?.userRole || '3';
  const isRange = userRole === '3';

  const handleCalendarClose = async (dates) => {
    console.log("[DEBUG] Fechas recibidas:", dates);
    
    if (!dates || dates.length === 0) {
      alert("Por favor selecciona al menos una fecha válida");
      return;
    }
  
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.id_usuario) {
        throw new Error("Debes iniciar sesión para guardar disponibilidad");
      }

      const availabilityData = dates.map(date => ({
        fecha_disponible: date.fecha_disponible,
        hora_inicial: date.hora_inicial,
        hora_final: date.hora_final
      }));

      // IMPORTANTE: Cambiar la URL según la configuración exacta de tu servidor
      const apiUrl = 'http://localhost:8080/Proton/backend/actions/availability.php';
      console.log("Enviando datos a:", apiUrl);

      // Configuración especial para evitar problemas con CORS
      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: {
          id_peluquero: userData.id_usuario,
          disponibilidades: availabilityData
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false, // IMPORTANTE: Cambiado a false
      });

      console.log("Respuesta del servidor:", response.data);
      alert("¡Disponibilidad guardada correctamente!");
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Respuesta del error:", error.response);
      
      let errorMessage = "Error al conectar con el servidor";
      if (error.response) {
        errorMessage = error.response.data?.message || 
                       `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor. Verifica que el servidor esté funcionando y la URL sea correcta.";
      } else {
        errorMessage = error.message || "Error desconocido";
      }
      
      alert(errorMessage);
    }
  };

  return (
    <div>
      <NavBar />
      <SubNavBar showBack currentPage='Turnos' />

      <div className="box" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        <h1>Gestión de turnos</h1>

        {showUserTypeSelector && (
          <UserTypeSelector 
            onlyRegistered={true} 
            onUserTypeChange={() => {}} 
          />
        )}

        <Calendar 
          isRange={isRange} 
          isMultiple={userRole === '3'}
          onClose={handleCalendarClose} 
        />
      </div>
    </div>
  );
};

export default Shifts;