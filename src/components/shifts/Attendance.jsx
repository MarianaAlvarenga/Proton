import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import SubNavBar from '../common/SubNavBar';
import PaymentQRModal from '../sales/PaymentQRModal'; 
import "./Attendance.css";

const Asistencia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const turnoBase = location.state?.turno;

  const [turno, setTurno] = useState(null);
  const [asistio, setAsistio] = useState(null);
  const [horaLlegada, setHoraLlegada] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [observaciones, setObservaciones] = useState("");
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchTurno = () => {
    if (!turnoBase?.id_turno) return;

    fetch(`https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/getTurnoById.php?id_turno=${turnoBase.id_turno}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Guardamos el turno que ya viene con el precio correcto desde PHP
          setTurno(data.turno);
        }
      })
      .catch(err => console.error("Error fetching turno:", err));
  };

  useEffect(() => {
    fetchTurno();
  }, []);

  const handleSubmit = () => {
    fetch("https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/saveAsistencia.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_turno: turno.id_turno,
        asistio,
        hora_llegada: asistio ? horaLlegada : null,
        hora_finalization: asistio ? horaFin : null,
        observaciones: asistio ? observaciones : null
      })
    })
      .then(res => res.json())
      .then(() => navigate(-1))
      .catch(console.error);
  };

  if (!turno) return null;

  return (
    <>
      <NavBar />
      <SubNavBar />

      <div className="container mt-5">
        <h1 className="title has-text-centered">
          Cliente: {turno.cliente_nombre} {turno.cliente_apellido}
        </h1>

        <h2 className="subtitle is-4">
          Fecha del turno: {turno.fecha}
        </h2>

        <h2 className="subtitle is-4">
          Horario del turno: {turno.hora_inicio} - {turno.hora_fin}
        </h2>

        <div className="field">
          <label className="subtitle is-4">¿Asistió al turno?</label>

          <div className="control mt-5">
            <label className="radio mr-6">
              <input
                type="radio"
                name="asistio"
                checked={asistio === true}
                onChange={() => setAsistio(true)}
              />
              SI
            </label>

            <label className="radio">
              <input
                type="radio"
                name="asistio"
                checked={asistio === false}
                onChange={() => setAsistio(false)}
              />
              NO
            </label>
          </div>
        </div>

        {/* --- SECCIÓN DE PAGO DINÁMICA --- */}
        <div className={`notification ${turno.pagado ? 'is-success' : 'is-danger'} is-light mt-4 is-flex is-align-items-center is-justify-content-space-between`}>
          <span className="has-text-weight-bold">
            <i className={`fas ${turno.pagado ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2`}></i> 
            {turno.pagado ? 'YA ABONADO' : 'NO ABONADO'}
          </span>
          
          {!turno.pagado && (
            <button 
              className="button is-danger is-small"
              onClick={() => setShowPaymentModal(true)}
            >
              Pagar ahora (${turno.precio})
            </button>
          )}
        </div>

        {asistio === true && (
          <>
            <div className="field mt-4">
              <label className="label">Hora de llegada</label>
              <input className="input" type="time" value={horaLlegada} onChange={e => setHoraLlegada(e.target.value)} />
            </div>

            <div className="field mt-4">
              <label className="label">Hora de finalización</label>
              <input className="input" type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)} />
            </div>

            <div className="field mt-4">
              <label className="label">Observaciones</label>
              <textarea className="textarea" value={observaciones} onChange={e => setObservaciones(e.target.value)} />
            </div>
          </>
        )}

        <div className="is-flex" style={{ gap: "10px", marginTop: "20px" }}>
          <button className="button is-light" onClick={() => navigate(-1)}>
            Cancelar
          </button>

          <button className="button is-primary" onClick={handleSubmit} disabled={asistio === null}>
            Guardar
          </button>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentQRModal
          paymentDataInput={{
            turnoId: String(turno.id_turno),
            items: [{
              title: "Servicio de Peluquería",
              quantity: 1,
              // Usamos el precio real que viene de getTurnoById.php
              unit_price: Number(parseFloat(turno.precio).toFixed(2)), 
              currency_id: "ARS"
            }],
            payer: {
              name: `${turno.cliente_nombre} ${turno.cliente_apellido}`.trim(),
              email: "test_user@example.com"
            }
          }}
          onClose={(wasPaid) => {
            setShowPaymentModal(false);
            if (wasPaid) fetchTurno(); // Recarga los datos para actualizar el estado del pago
          }}
        />
      )}
    </>
  );
};

export default Asistencia;