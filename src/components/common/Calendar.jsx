import React, { useEffect, useRef, useState } from "react";
import "bulma-calendar/dist/css/bulma-calendar.min.css";
import "./custom-calendar.css";

const Calendar = ({ isRange, isMultiple, onClose }) => {
  const inputRef = useRef(null);
  const calendarInstance = useRef(null);
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const bulmaCalendar = require("bulma-calendar");

    const initCalendar = () => {
      if (!inputRef.current) return;

      if (calendarInstance.current) {
        calendarInstance.current.destroy();
      }

      calendarInstance.current = bulmaCalendar.attach(inputRef.current, {
        type: "datetime",
        dateFormat: "yyyy-MM-dd",
        timeFormat: "HH:mm",
        lang: "es",
        isRange,
        isMultiple,
        displayMode: "dialog",
        showHeader: true,
        showFooter: true,
        showButtons: true,
        validateLabel: "Confirmar",
        cancelLabel: "Cancelar",
        clearLabel: "Limpiar"
      })[0];

      calendarInstance.current.on("select", (datepicker) => {
        const rawDates = datepicker.data.value();
        if (!rawDates) return;

        let processedDates = [];
        
        if (isRange && rawDates.includes(' - ')) {
          const [start, end] = rawDates.split(' - ');
          const [startDate, startTime] = start.trim().split(' ');
          const [endDate, endTime] = end.trim().split(' ');
          
          processedDates.push({
            fecha_disponible: startDate,
            hora_inicial: startTime,
            hora_final: endTime,
            esRango: true
          });
        } else {
          const datesToProcess = Array.isArray(rawDates) ? rawDates : [rawDates];
          
          processedDates = datesToProcess.map(dateStr => {
            if (!dateStr) return null;
            
            const [datePart, timePart] = dateStr.trim().split(' ');
            return {
              fecha_disponible: datePart,
              hora_inicial: timePart,
              hora_final: calculateEndTime(timePart),
              esRango: false
            };
          }).filter(Boolean);
        }

        setSelectedDates(processedDates);
      });
    };

    const timer = setTimeout(initCalendar, 100);
    return () => clearTimeout(timer);
  }, [isRange, isMultiple]);

  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = (hours + 1) % 24;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (selectedDates.length === 0) {
      alert("Por favor selecciona fechas válidas usando el selector de fechas");
      return;
    }

    onClose(selectedDates);
  };

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      <input 
        type="datetime" 
        ref={inputRef}
        style={{ display: 'none' }} 
      />

      <button
        onClick={handleSave}
        className="button is-primary"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#9655C5',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
        data-testid="save-button"
      >
        Guardar disponibilidad
      </button>
    </div>
  );
};

export default Calendar;