// Shifts.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Calendar from '../components/common/Calendar';
import NavBar from '../components/common/NavBar';
import SubNavBar from '../components/common/SubNavBar';
import UserTypeSelector from '../components/common/UserTypeSelector';
import ComboBox from '../components/common/ComboBox';
import axios from 'axios';

const Shifts = () => {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = Number(user.rol || location.state?.userRole || 3); // convertir a número
  const isRange = false;
  const isSettingAvailability = userRole === 3; // solo peluquero configura disponibilidad

  // Estados para combobox de especialidades y peluqueros
  const [especialidades, setEspecialidades] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [peluqueros, setPeluqueros] = useState([]);
  const [selectedPeluquero, setSelectedPeluquero] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');

  // Traer especialidades solo si es admin o cliente
  useEffect(() => {
    if (userRole === 1 || userRole === 4) {
      const fetchEspecialidades = async () => {
        try {
          const res = await axios.get('http://localhost:8080/Proton/backend/actions/getEspecialidades.php');
          setEspecialidades(res.data || []);
        } catch (error) {
          console.error('Error obteniendo especialidades:', error);
        }
      };
      fetchEspecialidades();
    }
  }, [userRole]);

  // Traer peluqueros asociados a la especialidad seleccionada (solo cliente o admin)
  useEffect(() => {
    if (!(userRole === 1 || userRole === 4)) return;

    if (!selectedEspecialidad) {
      setPeluqueros([]);
      setSelectedPeluquero('');
      return;
    }

    const fetchPeluqueros = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/Proton/backend/actions/getPeluquerosByServicio.php?id_servicio=${selectedEspecialidad}`
        );
        setPeluqueros(res.data || []);
        setSelectedPeluquero('');
      } catch (error) {
        console.error('Error obteniendo peluqueros:', error);
      }
    };
    fetchPeluqueros();
  }, [selectedEspecialidad, userRole]);

  const handleCalendarClose = async (dates) => {
    if (!dates || dates.length === 0) {
      alert("Por favor selecciona al menos una fecha válida");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));

      if (isSettingAvailability) {
        if (!userData?.id_usuario) throw new Error("Debes iniciar sesión para guardar disponibilidad");

        await axios.post('http://localhost:8080/Proton/backend/actions/availability.php', {
          id_peluquero: userData.id_usuario,
          disponibilidades: dates
        }, { headers: { 'Content-Type': 'application/json' } });

        alert("¡Disponibilidad guardada correctamente!");
      } else {
        if (!selectedPeluquero) {
          throw new Error("Por favor selecciona un peluquero");
        }

        let emailCliente;
        if (userRole === 4) emailCliente = emailAdmin;
        else if (userRole === 1) emailCliente = undefined;

        await axios.post('http://localhost:8080/Proton/backend/actions/save_appointment.php', {
          id_peluquero: selectedPeluquero || userData.id_usuario,
          fecha: dates[0].fecha_disponible,
          hora_inicio: dates[0].hora_inicial,
          hora_fin: dates[0].hora_final,
          email_cliente: emailCliente
        }, { headers: { 'Content-Type': 'application/json' } });

        alert("¡Turno agendado correctamente!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.message || error.message || "Error desconocido");
    }
  };

  return (
    <div>
      <NavBar />
      <SubNavBar showBack currentPage='Turnos' />

      <div className="box" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        {/* Campo email solo admin */}
        {userRole === 4 && (
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

        {/* Combobox de especialidades solo cliente o admin */}
        {(userRole === 1 || userRole === 4) && especialidades.length > 0 && (
          <ComboBox
            value={selectedEspecialidad}
            onChange={(val) => setSelectedEspecialidad(val)}
            options={especialidades.map((e) => ({ value: e.id_servicio, label: e.nombre }))}
            placeholder="Seleccione una especialidad"
          />
        )}

        {/* Combobox de peluqueros solo cliente o admin */}
        {(userRole === 1 || userRole === 4) && peluqueros.length > 0 && (
          <ComboBox
            value={selectedPeluquero}
            onChange={(val) => setSelectedPeluquero(val)}
            options={peluqueros.map((p) => ({ value: p.id_usuario, label: p.nombre + ' ' + p.apellido }))}
            placeholder="Seleccione un peluquero"
          />
        )}

        <Calendar
          isRange={isRange}
          isMultiple={userRole === 3}
          onClose={handleCalendarClose}
          peluqueroId={userRole === 3 ? user.id_usuario : selectedPeluquero} // 👈 usar peluquero seleccionado o el propio
          isSettingAvailability={isSettingAvailability}
          userRole={userRole}
        />
      </div>
    </div>
  );
};

export default Shifts;
