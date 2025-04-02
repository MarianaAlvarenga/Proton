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
  const isSettingAvailability = !showUserTypeSelector;

  const handleCalendarClose = async (dates) => {
    if (!dates || dates.length === 0) {
      alert("Por favor selecciona al menos una fecha válida");
      return;
    }
  
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if (isSettingAvailability) {
        // Guardar disponibilidad
        if (!userData?.id_usuario) {
          throw new Error("Debes iniciar sesión para guardar disponibilidad");
        }

        const response = await axios({
          method: 'post',
          url: 'http://localhost:8080/Proton/backend/actions/availability.php',
          data: {
            id_peluquero: userData.id_usuario,
            disponibilidades: dates
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert("¡Disponibilidad guardada correctamente!");
      } else {
        // Agendar turno
        const email = document.querySelector('input[type="text"]')?.value;
        
        if (!email && showUserTypeSelector) {
          throw new Error("Por favor ingresa un email válido");
        }

        const response = await axios({
          method: 'post',
          url: 'http://localhost:8080/Proton/backend/actions/save_appointment.php',
          data: {
            id_peluquero: userData.id_usuario,
            fecha: dates[0].fecha_disponible,
            hora_inicio: dates[0].hora_inicial,
            hora_fin: dates[0].hora_final,
            email_cliente: email
          },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        alert("¡Turno agendado correctamente!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || error.message || "Error desconocido");
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
          peluqueroId={user.id_usuario}
          isSettingAvailability={isSettingAvailability}
        />
        
      </div>
    </div>
  );
};

export default Shifts;