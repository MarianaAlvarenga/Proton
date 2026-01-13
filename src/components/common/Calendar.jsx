import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "./Calendar.css";
import Alert from "./Alert";

export default function Calendar({
  peluqueroId,
  isSettingAvailability,
  userRole,
  selectedServicioId,
  onClose,
  selectedClientEmail,
  isAgendarTurno,
  isAsistencia
}) {
  const navigate = useNavigate();
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
    fetch(
      `https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/get_availabilities.php?id_peluquero=${idPeluquero}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        let mapped = (data || []).map((avail) => ({
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
            id_peluquero: avail.id_peluquero,
          },
        }));

        if (isAsistencia) {
          const hoy = new Date().toISOString().split("T")[0];
          mapped = mapped.filter(
            (e) =>
              e.extendedProps.estado === "ocupado" &&
              e.extendedProps.fecha_disponible === hoy
          );
        }

        setEvents(mapped);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching disponibilidades:", error);
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
      const next = new Date(current.getTime() + 60 * 30 * 1000);
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
          isTemp: true,
        },
      });

      newSlots.push({
        fecha_disponible: fechaStr,
        hora_inicial: horaInicio,
        hora_final: horaFin,
        esRango: false,
      });

      current = next;
    }

    setEvents((prev) => [...prev, ...newEvents]);
    setSelectedSlots((prev) => [...prev, ...newSlots]);
  };

  const handleEventClick = async (info) => {
    if (isAsistencia) {
      navigate("/Asistencia", {
        state: {
          turno: {
            id_turno: info.event.extendedProps.turno_id
          }
        }
      });
      return;
    }

    const estado = info.event.extendedProps?.estado || "disponible";

    if (isSettingAvailability && userRole === 3) {
      if (estado === "ocupado") {
        Alert({
          Title: "Acción no permitida",
          Detail: "No podés eliminar un turno ya reservado.",
          icon: "error"
        });
        return;
      }

      const confirmDelete = await Alert({
        Title: "Eliminar horario",
        Detail: "¿Seguro que querés eliminar este horario?",
        Confirm: "Eliminar",
        Cancel: "Cancelar",
        icon: "warning",
        OnCancel: () => {}
      });

      if (!confirmDelete.isConfirmed) return;

      if (info.event.extendedProps?.isTemp) {
        setEvents((prev) => prev.filter((e) => e.id !== info.event.id));
        setSelectedSlots((prev) =>
          prev.filter(
            (slot) =>
              !(
                slot.fecha_disponible === info.event.extendedProps?.fecha_disponible &&
                slot.hora_inicial === info.event.extendedProps?.hora_inicial &&
                slot.hora_final === info.event.extendedProps?.hora_final
              )
          )
        );
        return;
      }

      try {
        const fecha_disponible = info.event.extendedProps?.fecha_disponible;
        const hora_inicial = info.event.extendedProps?.hora_inicial;
        const hora_final = info.event.extendedProps?.hora_final;
        const id_peluquero = info.event.extendedProps?.id_peluquero || peluqueroId;

        if (!fecha_disponible || !hora_inicial || !hora_final || !id_peluquero) {
          Alert({
            Title: "Error",
            Detail: "No se puede eliminar: datos incompletos.",
            icon: "error"
          });
          return;
        }

        const res = await fetch(
          "https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/delete_availability.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_peluquero: id_peluquero,
              fecha: fecha_disponible,
              hora_inicio: hora_inicial,
              hora_fin: hora_final,
            }),
          }
        );

        const responseText = await res.text();
        const json = JSON.parse(responseText);

        if (!res.ok || json.success === false) {
          Alert({
            Title: "Error",
            Detail: json.message || "No se pudo eliminar la disponibilidad.",
            icon: "error"
          });
          return;
        }

        fetchDisponibilidades(peluqueroId);
        Alert({
          Title: "Listo",
          Detail: "Disponibilidad eliminada correctamente.",
          icon: "success"
        });
      } catch (error) {
        Alert({
          Title: "Error",
          Detail: "Error eliminando disponibilidad: " + error.message,
          icon: "error"
        });
      }

      return;
    }

    if (!isSettingAvailability || (userRole === 3 && isAgendarTurno)) {
      if (!(userRole === 1 || userRole === 3 || userRole === 4)) {
        Alert({
          Title: "Acceso denegado",
          Detail: "No autorizado para reservar turnos.",
          icon: "error"
        });
        return;
      }

      if (estado === "ocupado") {
        Alert({
          Title: "Turno ocupado",
          Detail: "Este turno ya está ocupado.",
          icon: "warning"
        });
        return;
      }

      if (userRole !== 3 && !selectedServicioId) {
        Alert({
          Title: "Falta información",
          Detail: "Por favor seleccioná primero la especialidad a reservar.",
          icon: "warning"
        });
        return;
      }

      if (!peluqueroId) {
        Alert({
          Title: "Falta información",
          Detail: "Por favor seleccioná un peluquero.",
          icon: "warning"
        });
        return;
      }

      if ((userRole === 4 || (userRole === 3 && isAgendarTurno)) && !selectedClientEmail) {
        Alert({
          Title: "Cliente no seleccionado",
          Detail: "Seleccioná un cliente antes de reservar el turno.",
          icon: "warning"
        });
        return;
      }

      const startDate = new Date(info.event.start);
      const fecha_disponible = startDate.toISOString().split("T")[0];
      const hora_inicial = startDate.toTimeString().substring(0, 5);
      const hora_final = new Date(info.event.end).toTimeString().substring(0, 5);

      const confirmMsg = `¿Confirmás reservar el turno el ${fecha_disponible} de ${hora_inicial} a ${hora_final}?`;

      const confirmReserva = await Alert({
        Title: "Confirmar turno",
        Detail: confirmMsg,
        Confirm: "Confirmar",
        Cancel: "Cancelar",
        icon: "question",
        OnCancel: () => {}
      });

      if (!confirmReserva.isConfirmed) return;

      const user = JSON.parse(localStorage.getItem("user")) || {};

      try {
        const res = await fetch(
          "https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/save_appointment.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fecha: fecha_disponible,
              hora_inicio: hora_inicial,
              hora_fin: hora_final,
              id: user.id_usuario,
              userRole: user.rol,
              id_peluquero: peluqueroId,
              servicio_id: selectedServicioId,
              email_cliente: selectedClientEmail || null,
            }),
          }
        );

        const responseText = await res.text();
        const json = JSON.parse(responseText);

        if (!res.ok || !json.success) {
          Alert({
            Title: "Error",
            Detail: json.message || "No se pudo reservar el turno.",
            icon: "error"
          });
          fetchDisponibilidades(peluqueroId);
          return;
        }

        fetchDisponibilidades(peluqueroId);
        Alert({
          Title: "Turno reservado",
          Detail: "Turno reservado correctamente.",
          icon: "success"
        });
      } catch (error) {
        Alert({
          Title: "Error",
          Detail: "Error al reservar turno.",
          icon: "error"
        });
        fetchDisponibilidades(peluqueroId);
      }
    }
  };

  const handleSave = async () => {
    if (selectedSlots.length === 0) {
      Alert({
        Title: "Atención",
        Detail: "No hay horarios seleccionados para guardar.",
        icon: "warning"
      });
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const id_peluquero = userData?.id_usuario;

      if (!id_peluquero) {
        Alert({
          Title: "Sesión requerida",
          Detail: "Debes iniciar sesión para guardar disponibilidad.",
          icon: "warning"
        });
        return;
      }

      const res = await fetch(
        "https://reconstruction-parish-establishing-axis.trycloudflare.com/backend/actions/availability.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_peluquero: id_peluquero,
            disponibilidades: selectedSlots,
          }),
        }
      );

      const responseText = await res.text();
      const result = JSON.parse(responseText);

      if (!res.ok || !result.success) {
        throw new Error(result.message || "No se pudo guardar la disponibilidad.");
      }

      Alert({
        Title: "Guardado",
        Detail: "Disponibilidad guardada correctamente.",
        icon: "success"
      });

      if (onClose) {
        onClose(selectedSlots);
      }
    } catch (error) {
      Alert({
        Title: "Error",
        Detail: `Error al guardar la disponibilidad: ${error.message}`,
        icon: "error"
      });
    }
  };

  if (loading) return <p>Cargando calendario...</p>;

  return (
    <div className="calendar-container">
      <h1 className="title is-3 has-text-centered">Calendario</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isAsistencia ? "timeGridDay" : "timeGridWeek"}
        selectable={!isAsistencia}
        events={events}
        select={handleSelect}
        eventClick={handleEventClick}
      />
      {isSettingAvailability && (
        <div
          className="calendar-footer"
          style={{ marginTop: "1rem", marginBottom: "2rem" }}
        >
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
