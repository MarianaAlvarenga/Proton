import React, { useEffect, useState } from "react";
import "bulma-calendar/dist/css/bulma-calendar.min.css";
import "./custom-calendar.css";
import OkButton from "./OkButton";

const Calendar = ({ isRange, isMultiple, onDatesChange, onClose }) => {
  const [calendarInstance, setCalendarInstance] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const bulmaCalendar = require("bulma-calendar");

    try {
      // Limpia la instancia previa si existe
      if (calendarInstance) {
        calendarInstance.destroy();
      }

      // Selecciona el input de fecha y hora
      const input = document.querySelector('[type="datetime-local"]');
      if (!input) {
        console.error("No se encontró el elemento input para Bulma Calendar.");
        return;
      }

      // Inicializa el calendario
      const calendar = bulmaCalendar.attach(input, {
        type: "datetime",
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm:ss",
        lang: "es",
        isRange: isRange, // Habilitar/deshabilitar rango
        isMultiple: isMultiple, // Habilitar/deshabilitar selección múltiple
        displayMode: "dialog",
      })[0]; // Obtenemos la primera instancia

      if (!calendar) {
        console.error("No se pudo inicializar Bulma Calendar.");
        return;
      }

      // Configura el evento de selección
      calendar.on("select", (dates) => {
        // Si es un solo cliente, deselecciona la fecha anterior y selecciona la nueva
        if (!isRange) {
          setSelectedDates([dates[0]]); // Solo seleccionamos una fecha
        } else {
          setSelectedDates(dates); // Selección de rango de fechas
        }
        if (onDatesChange) {
          onDatesChange(dates);
        }
      });

      // Guarda la instancia
      setCalendarInstance(calendar);
    } catch (error) {
      console.error("Error al inicializar Bulma Calendar:", error);
    }

    // Limpieza cuando se desmonta el componente
    return () => {
      if (calendarInstance) {
        calendarInstance.destroy();
      }
    };
  }, [isRange, isMultiple, onDatesChange]);

  return (
    <div className="field">
      <label className="label">Selecciona fechas y horas</label>
      <div className="control">
        <input type="datetime-local" className="input" />
      </div>

      {/* Muestra las fechas seleccionadas */}
      {selectedDates.length > 0 && (
        <div>
          <p>
            <strong>Fechas seleccionadas:</strong>
          </p>
          <ul>
            {selectedDates.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Botón para cerrar el calendario */}
      <div className="control save-close-button">
        <OkButton
          NameButton="Guardar y cerrar"
          onClick={() => onClose(selectedDates)}
        >
          Cerrar y guardar
        </OkButton>
      </div>
    </div>
  );
};

export default Calendar;
