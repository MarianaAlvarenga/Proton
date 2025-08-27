import React, { useEffect, useRef, useState } from "react";
import "bulma-calendar/dist/css/bulma-calendar.min.css";
import "./custom-calendar.css";
import axios from "axios";

const Calendar = ({ isRange, isMultiple, onClose, peluqueroId, isSettingAvailability }) => {
  const inputRef = useRef(null);
  const calendarInstance = useRef(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [existingAvailabilities, setExistingAvailabilities] = useState([]);
  const [showEditBtn, setShowEditBtn] = useState(false); // controla visibilidad del botón

  useEffect(() => {
    if (!isSettingAvailability && peluqueroId) {
      fetchAvailabilities();
    }
  }, [peluqueroId, isSettingAvailability]);

  const fetchAvailabilities = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Proton/backend/actions/get_availabilities.php?id_peluquero=${peluqueroId}`
      );
      setExistingAvailabilities(response.data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    }
  };

  useEffect(() => {
    const bulmaCalendar = require("bulma-calendar");

    const initCalendar = () => {
      if (!inputRef.current) return;

      if (calendarInstance.current) {
        calendarInstance.current.destroy();
      }

      const options = {
        type: "datetime",
        dateFormat: "yyyy-MM-dd",
        timeFormat: "HH:mm",
        lang: "es",
        isRange: isSettingAvailability,
        isMultiple: isSettingAvailability,
        displayMode: "inline", 
        showHeader: true,
        showFooter: false,
        showButtons: true,
        validateLabel: "Confirmar",
        cancelLabel: "Cancelar",
        clearLabel: "Limpiar",
        disabledDates: getDisabledDates(),
        availableDates: !isSettingAvailability
          ? existingAvailabilities.map((avail) => ({
              date: avail.fecha_disponible,
              time: avail.hora_inicial,
            }))
          : [],
        highlightAvailableDates: !isSettingAvailability,
      };

      calendarInstance.current = bulmaCalendar.attach(inputRef.current, options)[0];

      // Evento al seleccionar fechas
      calendarInstance.current.on("select", (datepicker) => {
        const rawDates = datepicker.data.value();
        if (!rawDates) return;

        let processedDates = [];

        if (isSettingAvailability && rawDates.includes(" - ")) {
          const [start, end] = rawDates.split(" - ");
          const [startDate, startTime] = start.trim().split(" ");
          const [endDate, endTime] = end.trim().split(" ");

          processedDates.push({
            fecha_inicio: startDate,
            fecha_fin: endDate,
            hora_inicial: startTime,
            hora_final: endTime,
            esRango: true,
          });
        } else {
          const datesToProcess = Array.isArray(rawDates) ? rawDates : [rawDates];

          processedDates = datesToProcess
            .map((dateStr) => {
              if (!dateStr) return null;
              const [datePart, timePart] = dateStr.trim().split(" ");
              return {
                fecha_disponible: datePart,
                hora_inicial: timePart,
                hora_final: calculateEndTime(timePart),
                esRango: false,
              };
            })
            .filter(Boolean);
        }

        setSelectedDates(processedDates);

        // Mostrar botón si hay fechas seleccionadas
        setShowEditBtn(processedDates.length > 0);
      });

      // Evento al cerrar el calendario
      calendarInstance.current.on("hide", () => {
        setShowEditBtn(false);
      });
    };

    const timer = setTimeout(initCalendar, 100);
    return () => clearTimeout(timer);
  }, [isRange, isMultiple, existingAvailabilities, isSettingAvailability]);

  const getDisabledDates = () => {
    const disabledDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 1);

    while (pastDate >= new Date(2020, 0, 1)) {
      disabledDates.push(pastDate.toISOString().split("T")[0]);
      pastDate.setDate(pastDate.getDate() - 1);
    }

    if (!isSettingAvailability) {
      const availableDates = existingAvailabilities.map((avail) => avail.fecha_disponible);
      const futureDate = new Date(today);
      futureDate.setFullYear(today.getFullYear() + 1);

      while (today <= futureDate) {
        const dateStr = today.toISOString().split("T")[0];
        if (!availableDates.includes(dateStr)) {
          disabledDates.push(dateStr);
        }
        today.setDate(today.getDate() + 1);
      }
    }

    return disabledDates;
  };

  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = (hours + 1) % 24;
    return `${endHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const handleSave = () => {
    if (selectedDates.length === 0) {
      alert("Por favor selecciona fechas válidas usando el selector de fechas");
      return;
    }
    onClose(selectedDates);
  };

  return (
    <div style={{ position: "relative", minHeight: "800px", textAlign: "center"}}>
      <input type="datetime" ref={inputRef} style={{ display: "none" }} />
      {showEditBtn && (
        <button
          className="button is-warning"
          style={{
            top: "0px",
            right: "50px",
            zIndex: 9999,
            padding: "10px 12px",
            minWidth: "200px",   // ancho mínimo para que el texto no se corte
            whiteSpace: "nowrap", 
            backgroundColor: "#9655C5",
            color: "white",
          }}
          onClick={() => alert("Editar disponibilidad")}
        >
          Editar disponibilidad
        </button>
      )}


      <button
        onClick={handleSave}
        className="button is-primary is-fullwidth"
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#9655C5",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {isSettingAvailability ? "Guardar disponibilidad" : "Confirmar turno"}
      </button>
    </div>
  );
};

export default Calendar;
