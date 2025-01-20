import React, { useState } from 'react';
import Calendar from '../components/common/Calendar';
import NavBar from '../components/common/NavBar';
import SubNavBar from '../components/common/SubNavBar';

// LE FALTA UN MONTOOON*******************
// UNIFICAR CSS***************************
// SE VE HORRIBLE Y VAYA ASABER UNO SI VA A SERVIR*************

// PARA UTILIZARLO SE MANDA LA PROPIEDAD userRole = "peluquero" para poder seleccionar rangos de fecha.
// si se manda sin propiedad, no se permiten los rangos (usuario cliente) 
const Shifts = ({ userRole }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  
  // Determina si se debe permitir un rango basado en el rol del usuario
  const isRange = userRole === 'peluquero'; // Si el rol es peluquero, permitimos rango de fechas

  // Maneja el cierre del calendario y recibe las fechas seleccionadas
  const handleCalendarClose = (dates) => {
    setSelectedDates(dates);
    // Aquí podrías guardar las fechas o hacer algo más
  };

  return (
    <div>
      <NavBar></NavBar>
      <SubNavBar showBack currentPage='Turnos'></SubNavBar>
              
        <div className="box" style={{ paddingTop:'0px', paddingBottom:'0px' }}>
          {/* Pasamos el parámetro isRange al Calendar */}
          <h1>Gestión de turnos</h1>
          <Calendar 
            isRange={isRange} 
            onDatesChange={setSelectedDates} 
            onClose={handleCalendarClose} 
          />
        </div>
          {/* Mostrar las fechas seleccionadas */}
          {selectedDates.length > 0 && (
            <div>
              <p><strong>Fechas seleccionadas:</strong></p>
              <ul>
                {selectedDates.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
            </div>
        
      )}
    </div>
  );
};

export default Shifts;