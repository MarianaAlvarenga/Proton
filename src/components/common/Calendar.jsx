import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import "bulma/css/bulma.min.css";
import "./Calendar.css";
import Alert from "./Alert";
import Swal from "sweetalert2";

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
      `https://while-expertise-wed-lately.trycloudflare.com/backend/actions/get_availabilities.php?id_peluquero=${idPeluquero}`
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
      const next = new Date(current.getTime() + 30 * 60 * 1000);
      const horaFin = next.toTimeString().substring(0, 5);

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
    const estado = info.event.extendedProps?.estado || "disponible";

    // ============================
    // 👉 AGENDAR TURNO
    // ============================
    if (isAgendarTurno) {
      const user = JSON.parse(localStorage.getItem("user"));

      let emailClienteFinal = null;

      if (userRole === 1) {
        emailClienteFinal = user?.email;
      } else {
        if (
          !selectedClientEmail ||
          typeof selectedClientEmail !== "string" ||
          !selectedClientEmail.includes("@")
        ) {
          Alert({
            Title: "Cliente no seleccionado",
            Detail: "Debes seleccionar un email válido antes de agendar un turno.",
            icon: "warning"
          });
          return;
        }
        emailClienteFinal = selectedClientEmail;
      }

      if (estado === "ocupado") {
        Alert({
          Title: "Turno no disponible",
          Detail: "Este horario ya fue reservado.",
          icon: "error"
        });
        return;
      }

      const confirm = await Alert({
        Title: "Reservar turno",
        Detail: "¿Querés reservar este turno?",
        Confirm: "Reservar",
        Cancel: "Cancelar",
        icon: "question"
      });

      if (!confirm.isConfirmed) return;

      try {
        const res = await fetch(
          "https://while-expertise-wed-lately.trycloudflare.com/backend/actions/save_appointment.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_peluquero: info.event.extendedProps.id_peluquero,
              fecha: info.event.extendedProps.fecha_disponible,
              hora_inicio: info.event.extendedProps.hora_inicial,
              hora_fin: info.event.extendedProps.hora_final,
              email_cliente: emailClienteFinal,
              id: user?.id_usuario,
              userRole: userRole
            })
          }
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "No se pudo reservar el turno");
        }

        Alert({
          Title: "Turno reservado",
          Detail: "El turno fue reservado correctamente.",
          icon: "success"
        });

        fetchDisponibilidades(peluqueroId);
      } catch (error) {
        Alert({
          Title: "Error",
          Detail: error.message,
          icon: "error"
        });
      }

      return;
    }

    // ============================
    // 👉 ASISTENCIA
    // ============================
    if (isAsistencia) {
      navigate("/Asistencia", {
        state: { turno: { id_turno: info.event.extendedProps.turno_id } }
      });
      return;
    }

    // ============================
    // 👉 DISPONIBILIDAD (PELUQUERO)
    // ============================
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
        OnCancel: () => Swal.close()
      });

      if (!confirmDelete.isConfirmed) return;

      if (info.event.extendedProps?.isTemp) {
        setEvents((prev) => prev.filter((e) => e.id !== info.event.id));
        setSelectedSlots((prev) =>
          prev.filter(
            (s) =>
              !(
                s.fecha_disponible === info.event.extendedProps.fecha_disponible &&
                s.hora_inicial === info.event.extendedProps.hora_inicial &&
                s.hora_final === info.event.extendedProps.hora_final
              )
          )
        );
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

    const user = JSON.parse(localStorage.getItem("user"));
    const id_peluquero = user?.id_usuario;

    if (!id_peluquero) {
      Alert({
        Title: "Sesión requerida",
        Detail: "Debes iniciar sesión para guardar disponibilidad.",
        icon: "warning"
      });
      return;
    }

    try {
      const res = await fetch(
        "https://while-expertise-wed-lately.trycloudflare.com/backend/actions/availability.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_peluquero,
            disponibilidades: selectedSlots,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "No se pudo guardar la disponibilidad.");
      }

      Alert({
        Title: "Guardado",
        Detail: "Disponibilidad guardada correctamente.",
        icon: "success"
      });

      setSelectedSlots([]);
      fetchDisponibilidades(id_peluquero);

      if (onClose) onClose();
    } catch (error) {
      Alert({
        Title: "Error",
        Detail: error.message,
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
        <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
          <button
            className="button is-fullwidth"
            style={{
              backgroundColor: "#9b59b6",
              color: "white",
              fontWeight: "bold"
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
