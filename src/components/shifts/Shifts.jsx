import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Calendar from './Calendar';
import NavBar from '../common/NavBar';
import SubNavBar from '../common/SubNavBar';
import ComboBox from '../common/ComboBox';
import PaymentQRModal from '../sales/PaymentQRModal';
import axios from 'axios';
import Swal from 'sweetalert2';

const Shifts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state || {};

  const isSettingAvailability = locationState.isSettingAvailability ?? locationState.mode === 'disponibilidad';
  const isAgendarTurno = locationState.isAgendarTurno ?? locationState.mode === 'agendar';
  const isAsistencia = locationState.mode === 'asistencia';

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const userRole = Number(locationState.userRole ?? user.rol ?? user.role ?? 3);

  const [especialidades, setEspecialidades] = useState([]);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const [peluqueros, setPeluqueros] = useState([]);
  const [selectedPeluquero, setSelectedPeluquero] = useState('');
  const [emailAdmin, setEmailAdmin] = useState('');

  // Estados para manejar el Modal de Pago
  const [showQRModal, setShowQRModal] = useState(false);
  const [currentPaymentData, setCurrentPaymentData] = useState(null);

  useEffect(() => {
    if (userRole === 1 || userRole === 4 || isAgendarTurno) {
      const fetchEspecialidades = async () => {
        try {
          const res = await axios.get('https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/getEspecialidades.php');
          setEspecialidades(res.data || []);
        } catch (error) {
          console.error('Error obteniendo especialidades:', error);
        }
      };
      fetchEspecialidades();
    }
  }, [userRole, isAgendarTurno]);

  useEffect(() => {
    if (!(userRole === 1 || userRole === 4 || isAgendarTurno)) return;
    if (!selectedEspecialidad) {
      setPeluqueros([]);
      setSelectedPeluquero('');
      return;
    }
    const fetchPeluqueros = async () => {
      try {
        const res = await axios.get(`https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/getPeluquerosByServicio.php?id_servicio=${selectedEspecialidad}`);
        setPeluqueros(res.data || []);
        setSelectedPeluquero('');
      } catch (error) {
        console.error('Error obteniendo peluqueros:', error);
      }
    };
    fetchPeluqueros();
  }, [selectedEspecialidad, userRole, isAgendarTurno]);

  const calendarPeluqueroId = isSettingAvailability || isAsistencia ? user.id_usuario : (isAgendarTurno ? (selectedPeluquero || user.id_usuario) : selectedPeluquero);

  const handleCalendarClose = () => {
    if (isSettingAvailability) navigate('/MenuGroomer');
  };

  const handleReservaExitosa = async (turnoId) => {
    const servicio = especialidades.find(e => String(e.id_servicio) === String(selectedEspecialidad));

    const result = await Swal.fire({
      title: 'Turno reservado ✅',
      text: '¿Cómo querés realizar el pago?',
      icon: 'success',
      showDenyButton: true,
      confirmButtonText: 'Pagar ahora',
      denyButtonText: 'Pagar el día del turno',
      denyButtonColor: "#6c757d",
      allowOutsideClick: false,
      allowEscapeKey: false,
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setCurrentPaymentData({
        items: [{
          title: `Turno: ${servicio?.nombre || 'Servicio Peluquería'}`,
          quantity: 1,
          unit_price: Number(servicio?.precio || 0),
          currency_id: "ARS"
        }],
        payer: {
          name: user.nombre || "Cliente",
          email: user.email || emailAdmin || "test_user@example.com"
        },
        turnoId: turnoId
      });
      setShowQRModal(true);
    } else if (result.isDenied) {
      const routes = { 1: '/MenuClient', 3: '/MenuGroomer', 4: '/MenuAdmin' };
      navigate(routes[userRole] || '/');
    }
  };

  // NUEVA FUNCIÓN: Maneja el cierre del modal y la redirección
  const handlePaymentModalClose = (wasPaid) => {
    setShowQRModal(false);
    if (wasPaid) {
      const routes = { 1: '/MenuClient', 3: '/MenuGroomer', 4: '/MenuAdmin' };
      navigate(routes[userRole] || '/');
    }
  };

  return (
    <div>
      <NavBar />
      <SubNavBar showBack currentPage="Turnos" />

      <div className="box" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
        {!isAsistencia && ((userRole === 4) || (userRole === 3 && isAgendarTurno)) && (
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

        {!isAsistencia && (userRole === 1 || userRole === 4 || isAgendarTurno) && especialidades.length > 0 && (
          <ComboBox
            value={selectedEspecialidad}
            onChange={(val) => setSelectedEspecialidad(val)}
            options={especialidades.map((e) => ({
              value: e.id_servicio,
              label: `${e.nombre} - $${e.precio}`,
            }))}
            placeholder="Seleccione una especialidad"
          />
        )}

        {!isAsistencia && (userRole === 1 || userRole === 4 || isAgendarTurno) && peluqueros.length > 0 && (
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

        <Calendar
          peluqueroId={calendarPeluqueroId}
          isRange={false}
          isMultiple={userRole === 3}
          onClose={handleCalendarClose}
          isSettingAvailability={isSettingAvailability}
          userRole={userRole}
          selectedServicioId={selectedEspecialidad}
          selectedClientEmail={emailAdmin}
          isAgendarTurno={isAgendarTurno}
          isAsistencia={isAsistencia}
          onReservaExitosa={handleReservaExitosa}
        />
      </div>

      {showQRModal && (
        <PaymentQRModal
          paymentDataInput={currentPaymentData}
          onClose={handlePaymentModalClose}
        />
      )}
    </div>
  );
};

export default Shifts;