import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../common/NavBar';
import SubNavBar from '../common/SubNavBar';
import "./Asistencia.css";
import Label from '../common/Label'

const Asistencia = () =>{
    const user          = "Pepito";
    const fecha_turno   = "25/02/2026";
    const horario_turno = "17:00";

    const [asistio, setAsistio] = useState(null);

    const handleSubmit = () => {

    }
    return(
        <>
            <NavBar />
            <SubNavBar />
            <div className="container mt-5">                       
              <h1 className="title has-text-centered">
                  Cliente: {user}
              </h1>
              <h2 className="subtitle is-4">
                  Fecha del turno: {fecha_turno}
              </h2>
              <h2 className="subtitle is-4">
                  Horario del turno: {horario_turno}
              </h2>
              <div className="field">
                <label className="subtitle is-4">¿Asistió al turno?</label>

                <div className="control mt-5">
                  <label className="radio mr-6">
                    <input
                      type="radio"
                      name="estado"
                      value="si"
                      onChange={() => setAsistio(true)}
                    />
                    SI
                  </label>

                  <label className="radio">
                    <input
                      type="radio"
                      name="estado"
                      value="no"
                      onChange={() => setAsistio(false)}
                    />
                    NO
                  </label>
                </div>
              </div>

              {asistio === true && (
                <>
                  <div className="field mt-4">
                    <label className="label">Hora de llegada:</label>
                    <div className="control">
                      <input className="input" type="time" />
                    </div>
                  </div>

                  <div className="field mt-4">
                    <label className="label">Hora de Finalización:</label>
                    <div className="control">
                      <input className="input" type="time" />
                    </div>
                  </div>

                  <div className="field mt-4">
                    <label className="label">Observaciones:</label>
                    <div className="control">
                      <textarea className="textarea" />
                    </div>
                  </div>
                </>
              )}

                <div className="is-flex" style={{ gap: "10px", margin: "20px" }}>

                  <button
                    type="button"
                    className="button is-primary is-fullwidth has-text-white"
                    style={{ flex: 1 }}
                    onClick={() => navigate(-1)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="button is-primary is-fullwidth has-text-white" 
                    style={{ flex: 1 }}
                  >
                    Aceptar
                  </button>
                </div>
            </div>
        </>
    )
}

export default Asistencia;
