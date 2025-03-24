import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'; // Importar useLocation
import Calendar from '../components/common/Calendar';
import NavBar from '../components/common/NavBar';
import SubNavBar from '../components/common/SubNavBar';
import UserTypeSelector from '../components/common/UserTypeSelector';

const Shifts = ({ userRole }) => {
  const location = useLocation(); // Obtener la ubicación actual
  const showUserTypeSelector = location.state?.showUserTypeSelector ?? true; // Leer el estado

  const [selectedDates, setSelectedDates] = useState([]);
  const isRange = userRole === 'peluquero';

  const handleCalendarClose = (dates) => {
    setSelectedDates(dates);
  };

  // Función que maneja los cambios en el UserTypeSelector
  const handleUserTypeChange = ({ isRegistered, email }) => {
    console.log("Usuario registrado:", isRegistered);
    console.log("Email:", email);
  };

  return (
    <div>
      <NavBar />
      <SubNavBar showBack currentPage='Turnos' />

      <div className="box" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        <h1>Gestión de turnos</h1>

        {/* Mostrar UserTypeSelector solo si showUserTypeSelector es true */}
        {showUserTypeSelector && (
          <UserTypeSelector 
            onlyRegistered={true} 
            onUserTypeChange={handleUserTypeChange} 
          />
        )}

        <Calendar 
          isRange={isRange} 
          onDatesChange={setSelectedDates} 
          onClose={handleCalendarClose} 
        />
      </div>

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