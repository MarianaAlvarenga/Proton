import React, { useEffect, useState } from "react";
import "bulma-calendar/dist/css/bulma-calendar.min.css";
import "./custom-calendar.css";

const Calendar = ({ onDatesChange }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const bulmaCalendar = require("bulma-calendar");

    // Inicializa Bulma Calendar con opciones avanzadas
    const calendars = bulmaCalendar.attach('[type="datetime-local"]', {
      type: "datetime",
      dateFormat: "YYYY-MM-DD",
      timeFormat: "HH:mm:ss",
      lang: "es",
      isRange: true, // Habilitar selección de rango
      isMultiple: true, // Permitir múltiples selecciones
      displayMode: "dialog",
    });

    // Escucha los eventos de selección
    calendars.forEach((calendar) => {
      calendar.on("select", (dates) => {
        console.log("Fechas seleccionadas:", dates); // Array con fechas seleccionadas
        setSelectedDates(dates);
        if (onDatesChange) {
          onDatesChange(dates); // Enviar fechas al componente padre
        }
      });
    });
  }, [onDatesChange]);

  return (
    <div className="field">
      <label className="label">Selecciona fechas y horas</label>
      <div className="control">
        <input type="datetime-local" className="input" />
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

export default Calendar;
