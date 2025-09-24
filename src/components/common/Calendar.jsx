// Calendar.jsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bulma/css/bulma.min.css";
import "./Calendar.css";

export default function Calendar({ userRole, isSettingAvailability }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const idPeluquero = JSON.parse(localStorage.getItem("user")).id_usuario;

  const fetchDisponibilidades = () => {
    setLoading(true);
    fetch(`http://localhost:8080/Proton/backend/actions/get_availabilities.php?id_peluquero=${idPeluquero}`)
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((avail) => ({
          title: "Disponible",
          start: `${avail.fecha_disponible}T${avail.hora_inicial}`,
          end: `${avail.fecha_disponible}T${avail.hora_final}`,
        }));
        setEvents(mapped);
        setLoading(false);
      })
      .catch((error) => { console.error(error); setLoading(false); });
  };

  useEffect(() => { fetchDisponibilidades(); }, []);

  const handleSelect = (info) => {
    if (!isSettingAvailability) return;

    const startDate = new Date(info.start);
    const endDate = new Date(info.end);

    const newEvents = [];
    let current = new Date(startDate);

    while (current < endDate) {
      const fechaStr = current.toISOString().split("T")[0];
      const horaInicio = current.toTimeString().substring(0, 5);

      const next = new Date(current.getTime() + 60 * 60 * 1000);
      let horaFin = next.toTimeString().substring(0, 5);

      if (next > endDate) horaFin = endDate.toTimeString().substring(0, 5);

      newEvents.push({
        title: "Disponible",
        start: `${fechaStr}T${horaInicio}`,
        end: `${fechaStr}T${horaFin}`,
      });

      current = next;
    }

    setEvents([...events, ...newEvents]);
  };

  const handleEventClick = async (info) => {
    if (!isSettingAvailability) return;
    if (!window.confirm("¿Eliminar este horario?")) return;

    const startDate = new Date(info.event.start);
    const endDate = new Date(info.event.end);

    const fecha_disponible = startDate.toISOString().split("T")[0];
    const hora_inicial = startDate.toTimeString().substring(0, 5);
    const hora_final = endDate.toTimeString().substring(0, 5);

    try {
      await fetch("http://localhost:8080/Proton/backend/actions/delete_availability.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_peluquero: idPeluquero, fecha_disponible, hora_inicial, hora_final })
      });

      fetchDisponibilidades();
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el horario de la base de datos.");
    }
  };

  const handleSave = async () => {
    try {
      const payload = events.map((e) => {
        const startDate = new Date(e.start);
        const endDate = new Date(e.end);

        return {
          fecha_disponible: startDate.toISOString().split("T")[0],
          hora_inicial: startDate.toTimeString().substring(0, 5),
          hora_final: endDate.toTimeString().substring(0, 5),
          esRango: false
        };
      });

      await fetch("http://localhost:8080/Proton/backend/actions/availability.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_peluquero: idPeluquero, disponibilidades: payload })
      });

      alert("Disponibilidad y turnos guardados correctamente.");
      window.location.href = "/MenuGroomer"; 
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar la disponibilidad.");
    }
  };

  if (loading) return <p>Cargando calendario...</p>;

  return (
    <div className="calendar-container">
      <h1 className="title is-3 has-text-centered">Calendario</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        selectable={true}
        events={events}
        select={handleSelect}
        eventClick={handleEventClick}
      />

      {isSettingAvailability && (
        <div className="calendar-footer" style={{ marginTop: "1rem", marginBottom: "2rem" }}>
          <button
            className="button is-fullwidth"
            style={{
              backgroundColor: "#9b59b6", // morado estilo foto
              color: "white",
              fontWeight: "bold",
            }}
            onClick={handleSave}
          >
            Guardar disponibilidad
          </button>
        </div>
      )}
    </div>
  );
}
