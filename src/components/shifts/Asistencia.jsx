import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import SubNavBar from '../common/SubNavBar';
import "./Asistencia.css";

const Asistencia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const turnoBase = location.state?.turno;

  const [turno, setTurno] = useState(null);
  const [asistio, setAsistio] = useState(null);
  const [horaLlegada, setHoraLlegada] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (!turnoBase?.id_turno) return;

    fetch(`https://jacket-parliament-carl-gem.trycloudflare.com/backend/actions/getTurnoById.php?id_turno=${turnoBase.id_turno}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setTurno(data.turno);
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = () => {
    fetch("https://jacket-parliament-carl-gem.trycloudflare.com/backend/actions/saveAsistencia.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_turno: turno.id_turno,
        asistio,
        hora_llegada: asistio ? horaLlegada : null,
        hora_finalizacion: asistio ? horaFin : null,
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
    </>
  );
};

export default Asistencia;
