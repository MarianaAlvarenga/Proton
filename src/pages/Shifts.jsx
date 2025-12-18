import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from '../components/common/Calendar';
import NavBar from '../components/common/NavBar';
import SubNavBar from '../components/common/SubNavBar';
import ComboBox from '../components/common/ComboBox';
import axios from 'axios';

const Shifts = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state || {};

  // modos derivados del state (mantener tu lógica actual)
  const isSettingAvailability = locationState.isSettingAvailability ?? (locationState.mode === "disponibilidad");
  const isAgendarTurno = locationState.isAgendarTurno ?? (locationState.mode === "agendar");
  const mode = locationState.mode || "";

  // user desde localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // userRole: primero el state, luego los campos del user guardado, y finalmente 3
  const userRole = Number(
    locationState.userRole ??
    user.rol ??
    user.role ??
    3
  );

  console.log("DEBUG Shifts: location.state =", locationState, "userFromStorage =", user, "resolved userRole =", userRole, "isAgendarTurno =", isAgendarTurno, "isSettingAvailability =", isSettingAvailability);


  const isRange = false;

  // Estados
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [peluqueros, setPeluqueros] = useState([]);
  const [selectedPeluquero, setSelectedPeluquero] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');

  // Traer especialidades (solo admin o cliente o cuando se está agendando)
  useEffect(() => {
    if (userRole === 1 || userRole === 4 || isAgendarTurno) {
      const fetchEspecialidades = async () => {
        try {
          const res = await axios.get('https://charter-driver-acid-smile.trycloudflare.com/backend/actions/getEspecialidades.php');
          setEspecialidades(res.data || []);
        } catch (error) {
          console.error('Error obteniendo especialidades:', error);
        }
      };
      fetchEspecialidades();
    }
  }, [userRole, isAgendarTurno]);

  // Traer peluqueros según especialidad
  useEffect(() => {
    if (!(userRole === 1 || userRole === 4 || isAgendarTurno)) return;
    if (!selectedEspecialidad) {
      setPeluqueros([]);
      setSelectedPeluquero('');
      return;
    }

    const fetchPeluqueros = async () => {
      try {
        const res = await axios.get(
          `https://charter-driver-acid-smile.trycloudflare.com/backend/actions/getPeluquerosByServicio.php?id_servicio=${selectedEspecialidad}`
        );
        setPeluqueros(res.data || []);
        setSelectedPeluquero('');
      } catch (error) {
        console.error('Error obteniendo peluqueros:', error);
      }
    };

    fetchPeluqueros();
  }, [selectedEspecialidad, userRole, isAgendarTurno]);

  // Calculamos el id de peluquero que le pasamos al Calendar:
  // - Si estamos definiendo disponibilidad: siempre el usuario autenticado (peluquero).
  // - Si un peluquero está en modo "agendar": también le pasamos su propio id para ver sus disponibilidades.
  // - En los demás casos (cliente/admin), se usa selectedPeluquero (se elige en el combobox).
  const calendarPeluqueroId = isSettingAvailability
    ? user.id_usuario
    : (userRole === 3 && isAgendarTurno ? user.id_usuario : selectedPeluquero);

  // Guardar turno o disponibilidad
  const handleCalendarClose = async (dates) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user')) || {};

      // --- GUARDAR DISPONIBILIDAD (solo peluquero en modo disponibilidad)
      if (isSettingAvailability) {
        if (!dates || dates.length === 0) {
          alert("Por favor seleccioná al menos una fecha válida");
          return;
        }

        await axios.post(
          'https://charter-driver-acid-smile.trycloudflare.com/backend/actions/save_availability.php',
          {
            id_peluquero: userData.id_usuario,
            disponibilidad: dates,
          },
          { headers: { 'Content-Type': 'application/json' } }
        );

        alert("¡Disponibilidad guardada correctamente!");
        navigate('/MenuGroomer');
        return;
      }

      // --- AGENDAR TURNO (admin, cliente o peluquero en modo agendar)
      if (!dates || dates.length === 0) {
        alert("Por favor seleccioná al menos una fecha válida");
        return;
      }

      if (!selectedPeluquero && (userRole === 1 || userRole === 4 || isAgendarTurno) && !(userRole === 3 && isAgendarTurno)) {
        // Si es admin/cliente requiere selectedPeluquero (salvo peluquero en modo agendar, que usa su propio id)
        throw new Error("Por favor seleccioná un peluquero");
      }

      // Determinar email del cliente según rol:
      let emailCliente = '';
      if (userRole === 4) {
        // admin: puede escribir email (si no lo hace, usamos fallback al email del admin??) -> mantenemos comportamiento previo
        emailCliente = emailAdmin || userData.email;
      } else if (userRole === 3 && isAgendarTurno) {
        // peluquero en modo agendar: **debe** ingresar el email del cliente
        emailCliente = emailAdmin;
        if (!emailCliente) throw new Error("Por favor ingresá el email del cliente al que le querés sacar el turno");
      } else if (userRole === 1) {
        // cliente: se usa su email
        emailCliente = userData.email;
      }

      await axios.post(
        'https://charter-driver-acid-smile.trycloudflare.com/backend/actions/save_appointment.php',
        {
          id_peluquero: selectedPeluquero || userData.id_usuario,
          fecha: dates[0].fecha_disponible,
          hora_inicio: dates[0].hora_inicial,
          hora_fin: dates[0].hora_final,
          email_cliente: emailCliente
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert("¡Turno agendado correctamente!");
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || error.message || "Error desconocido");
    }
  };

  console.log("location.state:", location.state);


  return (
    <div>
      <NavBar />
      <SubNavBar showBack currentPage='Turnos' />

      <div className="box" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        {((userRole === 4) || (userRole === 3 && isAgendarTurno)) && (
          <div style={{ marginBottom: '1em' }}>
            <label className="label">Email del cliente</label>
            <input
              type="text"
              className="input"
              value={emailAdmin}
              onChange={(e) => setEmailAdmin(e.target.value)}
              placeholder="Ingrese email del cliente"
            />
          </div>
        )}

        {/* Combobox de especialidades (cliente, admin o peluquero en modo agendar) */}
        {(userRole === 1 || userRole === 4 || isAgendarTurno) && especialidades.length > 0 && (
          <ComboBox
            value={selectedEspecialidad}
            onChange={(val) => setSelectedEspecialidad(val)}
            options={especialidades.map((e) => ({
              value: e.id_servicio,
              label: e.nombre,
            }))}
            placeholder="Seleccione una especialidad"
          />
        )}

        {/* Combobox de peluqueros (cliente, admin o peluquero en modo agendar) */}
        {(userRole === 1 || userRole === 4 || isAgendarTurno) && peluqueros.length > 0 && (
          <ComboBox
            value={selectedPeluquero}
            onChange={(val) => setSelectedPeluquero(val)}
            options={peluqueros.map((p) => ({
              value: p.id_usuario,
              label: `${p.nombre} ${p.apellido}`,
            }))}
            placeholder="Seleccione un peluquero"
          />
        )}

        {/* Calendario */}
        <Calendar
          peluqueroId={calendarPeluqueroId}
          isRange={isRange}
          isMultiple={userRole === 3}
          onClose={handleCalendarClose}
          isSettingAvailability={isSettingAvailability}
          userRole={userRole}
          selectedServicioId={selectedEspecialidad}
          selectedClientEmail={emailAdmin}
          isAgendarTurno={isAgendarTurno}
        />
      </div>
    </div>
  );
};

export default Shifts;
