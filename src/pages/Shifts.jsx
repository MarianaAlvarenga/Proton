import React, { useState } from 'react';
import Calendar from '../components/common/Calendar';
import NavBar from '../components/common/NavBar';
import SubNavBar from '../components/common/SubNavBar';
import UserTypeSelector from '../components/common/UserTypeSelector'; // Importar el nuevo componente

const Shifts = ({ userRole }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const isRange = userRole === 'peluquero';

  const handleCalendarClose = (dates) => {
    setSelectedDates(dates);
  };

  return (
    <div>
      <NavBar />
      <SubNavBar showBack currentPage='Turnos' />

      <div className="box" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        <h1>Gestión de turnos</h1>

        {/* Mostrar UserTypeSelector SOLO con la opción de usuario registrado */}
        <UserTypeSelector onlyRegistered={true} />

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
