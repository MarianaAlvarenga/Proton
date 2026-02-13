import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PaymentQRModal = ({ paymentDataInput, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [initPoint, setInitPoint] = useState(null);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  const pollingInterval = useRef(null);

  useEffect(() => {
    const generatePreference = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://independent-intent-telephone-printer.trycloudflare.com/backend/actions/create_preference.php",
          {
            items: paymentDataInput.items,
            payer: paymentDataInput.payer,
            turnoId: paymentDataInput.turnoId
          },
          { withCredentials: true }
        );

        if (response.data && response.data.init_point) {
          setInitPoint(response.data.init_point);
          startPolling(paymentDataInput.turnoId);
        } else {
          throw new Error("Respuesta inválida del servidor");
        }
      } catch (err) {
        console.error("Error generando preferencia:", err);
        setError(err.message || "Error al conectar con Mercado Pago");
      } finally {
        setLoading(false);
      }
    };

    if (paymentDataInput) generatePreference();
    return () => stopPolling();
  }, [paymentDataInput]);

  const startPolling = (turnoId) => {
    pollingInterval.current = setInterval(async () => {
      try {
        const res = await axios.get(`https://independent-intent-telephone-printer.trycloudflare.com/backend/actions/get_payment_status.php?turnoId=${turnoId}`);
        if (res.data && res.data.pagado === true) {
          setIsPaid(true);
          stopPolling();
          // Notificamos éxito al componente padre tras un breve delay visual
          setTimeout(() => onClose(true), 3500);
        }
      } catch (err) {
        console.error("Error verificando pago:", err);
      }
    }, 3000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
  };

  const qrImageUrl = initPoint
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(initPoint)}`
    : null;

  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 99999,
    backdropFilter: 'blur(4px)'
  };

  const modalStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '1.5rem',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    position: 'relative'
  };

  if (isPaid) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div className="mb-4 flex justify-center">
            <div className="bg-green-50 p-4 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Aprobado!</h3>
          <p className="text-gray-500">Tu turno ha sido confirmado. <br />Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div style={modalStyle} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-gray-100">
        <button
          onClick={() => onClose(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
        >
          &times;
        </button>

        <div className="mb-4 flex justify-center">
          <div className="bg-blue-50 p-3 rounded-full inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#009EE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '32px', height: '32px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-1" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Pago con QR</h3>
        <p className="text-gray-500 text-sm mb-6">Escaneá para abonar tu turno</p>

        {loading ? (
          <div className="py-12 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-[#009EE3]"></div>
            <p className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Generando código...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-red-500 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-sm font-bold">{error}</p>
            <button onClick={() => onClose(false)} className="mt-4 text-xs underline font-bold uppercase tracking-widest text-red-700">Cerrar</button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-white p-3 border-4 border-blue-50 rounded-3xl mb-6 shadow-sm inline-block">
              <img
                src={qrImageUrl}
                alt="QR de Pago"
                style={{ width: '220px', height: '220px', display: 'block' }}
                className="mx-auto rounded-lg"
              />
            </div>

            <p className="text-[10px] text-gray-400 mb-6 px-4 uppercase font-bold tracking-tighter" style={{ fontSize: '11px' }}>
              ID Turno: {paymentDataInput.turnoId}
            </p>

            <div className="flex items-center gap-2 text-blue-500 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
              <div className="relative flex h-2 w-2">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">Esperando el pago en tu celular...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentQRModal;