import React, { useEffect, useRef, useState } from "react";
import "bulma-calendar/dist/css/bulma-calendar.min.css";
import "./custom-calendar.css";
import axios from "axios";

const Calendar = ({ isRange, isMultiple, onClose, peluqueroId, isSettingAvailability }) => {
  const inputRef = useRef(null);
  const calendarInstance = useRef(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [existingAvailabilities, setExistingAvailabilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (peluqueroId) {
      fetchAvailabilities();
    } else {
      setIsLoading(false);
    }
  }, [peluqueroId]);

  const fetchAvailabilities = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/Proton/backend/actions/get_availabilities.php?id_peluquero=${peluqueroId}`
      );
      setExistingAvailabilities(response.data);
    } catch (error) {
      console.error("Error fetching availabilities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading || !inputRef.current) return;

    const bulmaCalendar = require("bulma-calendar");

    const initCalendar = () => {
      // Destruir instancia previa si existe
      if (calendarInstance.current) {
        try {
          calendarInstance.current.destroy();
        } catch (e) {
          console.warn("Error al destruir calendario previo:", e);
        }
        calendarInstance.current = null;
      }

      const options = {
        type: "datetime",
        dateFormat: "yyyy-MM-dd",
        timeFormat: "HH:mm",
        lang: "es",
        isRange: isSettingAvailability,
        isMultiple: isSettingAvailability && isMultiple,
        displayMode: "dialog",
        showHeader: true,
        showFooter: true,
        showButtons: true,
        validateLabel: "Confirmar",
        cancelLabel: "Cancelar",
        clearLabel: "Limpiar",
        disabledDates: getDisabledDates(),
        availableDates: !isSettingAvailability
          ? existingAvailabilities.map(avail => avail.fecha_disponible)
          : [],
        highlightAvailableDates: !isSettingAvailability
      };

      try {
        // Hacer el input visible temporalmente para que Bulma pueda inicializarlo
        inputRef.current.style.display = "block";
        
        calendarInstance.current = bulmaCalendar.attach(inputRef.current, options)[0];
        
        // Ocultar el input después de la inicialización
        inputRef.current.style.display = "none";

        // Establecer fechas seleccionadas si hay disponibilidades existentes
        if (existingAvailabilities.length > 0 && isSettingAvailability) {
          setTimeout(() => {
            if (calendarInstance.current) {
              try {
                const datesToSelect = existingAvailabilities.map(avail => {
                  return `${avail.fecha_disponible} ${avail.hora_inicial}`;
                });
                
                calendarInstance.current.value(datesToSelect);

                // 🔥 Forzar highlight en el calendario
                datesToSelect.forEach(date => {
                  try {
                    calendarInstance.current.select(date);
                  } catch (e) {
                    console.warn("Error seleccionando fecha inicial:", e);
                  }
                });

                setSelectedDates(existingAvailabilities);

              } catch (error) {
                console.error("Error setting calendar value:", error);
              }
            }
          }, 800); // Aumentado a 800ms para asegurar la inicialización completa
        }

        calendarInstance.current.on("select", (datepicker) => {
          const rawDates = datepicker.data.value();
          if (!rawDates) return;

          let processedDates = [];

          if (isSettingAvailability && typeof rawDates === 'string' && rawDates.includes(" - ")) {
            const [start, end] = rawDates.split(" - ");
            const [startDate, startTime] = start.trim().split(" ");
            const [endDate, endTime] = end.trim().split(" ");

            processedDates.push({
              fecha_inicio: startDate,
              fecha_fin: endDate,
              hora_inicial: startTime,
              hora_final: endTime,
              esRango: true
            });
          } else {
            const datesToProcess = Array.isArray(rawDates) ? rawDates : [rawDates];

            processedDates = datesToProcess
              .map(dateStr => {
                if (!dateStr || typeof dateStr !== 'string') return null;
                const [datePart, timePart] = dateStr.trim().split(" ");
                return {
                  fecha_disponible: datePart,
                  hora_inicial: timePart,
                  hora_final: calculateEndTime(timePart),
                  esRango: false
                };
              })
              .filter(Boolean);
          }

          setSelectedDates(processedDates);
        });

      } catch (error) {
        console.error("Error initializing calendar:", error);
        inputRef.current.style.display = "none";
      }
    };

    const timer = setTimeout(initCalendar, 100);
    return () => clearTimeout(timer);
  }, [isRange, isMultiple, existingAvailabilities, isSettingAvailability, isLoading]);

  useEffect(() => {
    // Cleanup al desmontar el componente
    return () => {
      if (calendarInstance.current) {
        try {
          calendarInstance.current.destroy();
        } catch (e) {
          console.warn("Error al destruir calendario durante cleanup:", e);
        }
      }
    };
  }, []);

  const getDisabledDates = () => {
    const disabledDates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Deshabilitar fechas pasadas
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - 1);

    while (pastDate >= new Date(2020, 0, 1)) {
      disabledDates.push(pastDate.toISOString().split("T")[0]);
      pastDate.setDate(pastDate.getDate() - 1);
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

  if (isLoading) {
    return <div>Cargando calendario...</div>;
  }

  return (
    <div style={{ position: "relative", minHeight: "400px" }}>
      <input
        type="text"
        ref={inputRef}
        style={{ display: "none" }}
        readOnly
      />

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
          cursor: "pointer"
        }}
      >
        {isSettingAvailability ? "Guardar disponibilidad" : "Confirmar turno"}
      </button>
    </div>
  );
};

export default Calendar;
