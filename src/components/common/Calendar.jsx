import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bulma/css/bulma.min.css";
import "./Calendar.css";

export default function Calendar({ peluqueroId, isSettingAvailability, userRole, selectedServicioId, onClose }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const fetchDisponibilidades = (idPeluquero) => {
    if (!idPeluquero) {
      setEvents([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    fetch(`http://localhost:8080/Proton/backend/actions/get_availabilities.php?id_peluquero=${idPeluquero}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        const mapped = (data || []).map((avail) => ({
          id: avail.id_turno || `avail-${avail.fecha_disponible}-${avail.hora_inicial}`,
          title: avail.estado === "ocupado" ? "Ocupado" : "Disponible",
          start: `${avail.fecha_disponible}T${avail.hora_inicial}`,
          end: `${avail.fecha_disponible}T${avail.hora_final}`,
          backgroundColor: avail.estado === "ocupado" ? "#e74c3c" : "#2ecc71",
          borderColor: avail.estado === "ocupado" ? "#c0392b" : "#27ae60",
          extendedProps: {
            estado: avail.estado || "disponible",
            turno_id: avail.id_turno,
            fecha_disponible: avail.fecha_disponible,
            hora_inicial: avail.hora_inicial,
            hora_final: avail.hora_final,
            id_peluquero: avail.id_peluquero
          },
        }));
        setEvents(mapped);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching disponibilidades:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDisponibilidades(peluqueroId);
  }, [peluqueroId]);

  const handleSelect = (info) => {
    if (!isSettingAvailability) return;

    const startDate = new Date(info.start);
    const endDate = new Date(info.end);
    const newEvents = [];
    const newSlots = [];

    let current = new Date(startDate);
    while (current < endDate) {
      const fechaStr = current.toISOString().split("T")[0];
      const horaInicio = current.toTimeString().substring(0, 5);
      const next = new Date(current.getTime() + 60 * 60 * 1000);
      let horaFin = next.toTimeString().substring(0, 5);
      
      if (next > endDate) horaFin = endDate.toTimeString().substring(0, 5);

      const eventId = `temp-${Date.now()}-${Math.random()}`;
      
      newEvents.push({
        id: eventId,
        title: "Disponible",
        start: `${fechaStr}T${horaInicio}`,
        end: `${fechaStr}T${horaFin}`,
        backgroundColor: "#2ecc71",
        borderColor: "#27ae60",
        extendedProps: {
          estado: "disponible",
          fecha_disponible: fechaStr,
          hora_inicial: horaInicio,
          hora_final: horaFin,
          isTemp: true
        },
      });

      newSlots.push({
        fecha_disponible: fechaStr,
        hora_inicial: horaInicio,
        hora_final: horaFin,
        esRango: false
      });

      current = next;
    }

    setEvents((prev) => [...prev, ...newEvents]);
    setSelectedSlots((prev) => [...prev, ...newSlots]);
  };

  const handleEventClick = async (info) => {
    const estado = info.event.extendedProps?.estado || "disponible";
    
    if (isSettingAvailability) {
      if (!window.confirm("¿Eliminar este horario?")) return;

      // Si es un evento temporal (no guardado), solo eliminar del state
      if (info.event.extendedProps?.isTemp) {
        setEvents((prev) => prev.filter(e => e.id !== info.event.id));
        
        setSelectedSlots((prev) => prev.filter(slot => 
          !(slot.fecha_disponible === info.event.extendedProps?.fecha_disponible &&
            slot.hora_inicial === info.event.extendedProps?.hora_inicial &&
            slot.hora_final === info.event.extendedProps?.hora_final)
        ));
        return;
      }

      // Evento guardado -> eliminar en DB
      try {
        const fecha_disponible = info.event.extendedProps?.fecha_disponible;
        const hora_inicial = info.event.extendedProps?.hora_inicial;
        const hora_final = info.event.extendedProps?.hora_final;
        const id_peluquero = info.event.extendedProps?.id_peluquero || peluqueroId;

        if (!fecha_disponible || !hora_inicial || !hora_final || !id_peluquero) {
          alert("No se puede eliminar: datos incompletos.");
          return;
        }

        const res = await fetch("http://localhost:8080/Proton/backend/actions/delete_availability.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id_peluquero: id_peluquero,
            fecha: fecha_disponible,
            hora_inicio: hora_inicial,
            hora_fin: hora_final
          }),
        });
        
        const responseText = await res.text();
        let json;
        try {
          json = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Error parseando JSON:", parseError);
          throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
        }

        if (!res.ok || json.success === false) {
          alert(json.message || "No se pudo eliminar la disponibilidad.");
          return;
        }
        
        // Recargar las disponibilidades después de eliminar
        fetchDisponibilidades(peluqueroId);
        alert("Disponibilidad eliminada correctamente.");
        
      } catch (error) {
        console.error("Error eliminando disponibilidad:", error);
        alert("Error eliminando disponibilidad: " + error.message);
      }
      return;
    }

    // --- Reserva de turno por cliente/admin ---
    if (!(userRole === 1 || userRole === 4)) {
      alert("No autorizado para reservar turnos.");
      return;
    }

    if (estado === "ocupado") {
      alert("Este turno ya está ocupado.");
      return;
    }

    if (!selectedServicioId) {
      alert("Por favor seleccioná primero la especialidad a reservar.");
      return;
    }

    if (!peluqueroId) {
      alert("Por favor seleccioná un peluquero.");
      return;
    }

    const startDate = new Date(info.event.start);
    const fecha_disponible = startDate.toISOString().split("T")[0];
    const hora_inicial = startDate.toTimeString().substring(0, 5);
    const hora_final = new Date(info.event.end).toTimeString().substring(0, 5);

    const confirmMsg = `¿Confirmás reservar el turno el ${fecha_disponible} de ${hora_inicial} a ${hora_final}?`;
    if (!window.confirm(confirmMsg)) return;

    const turno_id = info.event.extendedProps?.turno_id;
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const cliente_id = user.id_usuario || null;

    try {
      const res = await fetch("http://localhost:8080/Proton/backend/actions/save_appointment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turno_id,
          servicio_id: selectedServicioId,
          cliente_id,
          fecha: fecha_disponible,
          hora_inicio: hora_inicial,
          hora_fin: hora_final,
          id_peluquero: peluqueroId,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.message || "No se pudo reservar el turno.");
        fetchDisponibilidades(peluqueroId);
        return;
      }
      fetchDisponibilidades(peluqueroId);
      alert("Turno reservado correctamente.");
    } catch (error) {
      console.error(error);
      alert("Error al reservar turno.");
      fetchDisponibilidades(peluqueroId);
    }
  };

  const handleSave = async () => {
    if (selectedSlots.length === 0) {
      alert("No hay horarios seleccionados para guardar.");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const id_peluquero = userData?.id_usuario;

      if (!id_peluquero) {
        alert("Debes iniciar sesión para guardar disponibilidad");
        return;
      }

      console.log("Enviando disponibilidades:", selectedSlots);

      const res = await fetch("http://localhost:8080/Proton/backend/actions/availability.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_peluquero: id_peluquero,
          disponibilidades: selectedSlots
        }),
      });

      // Verificar si la respuesta es JSON válido
      const responseText = await res.text();
      console.log("Respuesta del servidor:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Error parseando JSON:", parseError);
        throw new Error(`Respuesta inválida del servidor: ${responseText.substring(0, 100)}`);
      }

      if (!res.ok || !result.success) {
        throw new Error(result.message || "No se pudo guardar la disponibilidad.");
      }

      // Éxito - llamar onClose para redirigir al MenuGroomer
      alert("Disponibilidad guardada correctamente.");
      if (onClose) {
        onClose(selectedSlots);
      }
      
    } catch (error) {
      console.error("Error al guardar disponibilidad:", error);
      alert(`Error al guardar la disponibilidad: ${error.message}`);
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
            style={{ backgroundColor: "#9b59b6", color: "white", fontWeight: "bold" }}
            onClick={handleSave}
          >
            Guardar disponibilidad
          </button>
        </div>
      )}
    </div>
  );
}