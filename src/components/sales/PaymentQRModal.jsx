import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * redirectToMP: true = redirigir a MercadoPago (solo cuando el CLIENTE paga su propio turno o su compra).
 * redirectToMP: false o no pasado = mostrar QR (admin/peluquero/vendedor cobrando, o pago desde Asistencia).
 */
const PaymentQRModal = ({ paymentDataInput, onClose, redirectToMP = false }) => {
  const [loading, setLoading] = useState(true);
  const [initPoint, setInitPoint] = useState(null);
  const [error, setError] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  const pollingInterval = useRef(null);

  // Redirigir a MercadoPago solo cuando el padre indica redirectToMP (ej: cliente pagando su turno desde "Pagar ahora" post-reserva)
  useEffect(() => {
    if (initPoint && redirectToMP) {
      window.location.href = initPoint;
    }
  }, [initPoint, redirectToMP]);

  useEffect(() => {
    const generatePreference = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "https://research-entire-infectious-collectables.trycloudflare.com/backend/actions/createPreference.php",
          {
            items: paymentDataInput.items,
            payer: paymentDataInput.payer,
            turnoId: paymentDataInput.turnoId,
            purchaseRef: paymentDataInput.purchaseRef,
            cart: paymentDataInput.cart,
            seller: paymentDataInput.seller
          },
          { withCredentials: true }
        );

        if (response.data && response.data.init_point) {
          setInitPoint(response.data.init_point);

          console.log("📋 paymentDataInput completo:", {
            turnoId: paymentDataInput.turnoId,
            purchaseRef: paymentDataInput.purchaseRef,
            hasTurnoId: !!paymentDataInput.turnoId,
            hasPurchaseRef: !!paymentDataInput.purchaseRef
          });

          // Turnos: polling por DB (turno.pagado)
          if (paymentDataInput.turnoId) {
            console.log("🟡 Iniciando polling de TURNO con ID:", paymentDataInput.turnoId);
            startPolling(paymentDataInput.turnoId);
          }

          // E-commerce: polling por referencia de compra (webhook -> tmp status)
          if (!paymentDataInput.turnoId && paymentDataInput.purchaseRef) {
            console.log("🔵 Iniciando polling de COMPRA con ref:", paymentDataInput.purchaseRef);
            startPurchasePolling(paymentDataInput.purchaseRef);
          } else if (!paymentDataInput.turnoId && !paymentDataInput.purchaseRef) {
            console.warn("⚠️ No hay turnoId ni purchaseRef, no se iniciará polling");
          }
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

    if (paymentDataInput) {
      console.log("🔄 useEffect ejecutado, paymentDataInput:", paymentDataInput);
      generatePreference();
    }
    return () => {
      console.log("🧹 Limpiando polling en cleanup");
      stopPolling();
    };
  }, [paymentDataInput]);

  const checkTurnoPaid = async (turnoId) => {
    try {
      const res = await axios.get(`https://research-entire-infectious-collectables.trycloudflare.com/backend/actions/getPaymentStatus.php?turnoId=${turnoId}`);
      const pagado = res.data && (res.data.pagado === true || res.data.pagado === 1);
      if (pagado) {
        setIsPaid(true);
        stopPolling();
        setTimeout(() => onClose(true), 2500);
        return true;
      }
    } catch (err) {
      console.error("Error verificando pago:", err);
    }
    return false;
  };

  const startPolling = (turnoId) => {
    checkTurnoPaid(turnoId); // primera comprobación inmediata
    pollingInterval.current = setInterval(() => checkTurnoPaid(turnoId), 3000);
  };

  const checkPurchasePaid = async (purchaseRef) => {
    try {
      const url = `https://research-entire-infectious-collectables.trycloudflare.com/backend/actions/get_purchase_payment_status.php?ref=${encodeURIComponent(purchaseRef)}`;
      const res = await axios.get(url);
      const paid = res.data && (res.data.paid === true || res.data.paid === 1);
      if (paid) {
        setIsPaid(true);
        stopPolling();
        setTimeout(() => onClose(true), 2500);
        return true;
      }
    } catch (err) {
      console.error("❌ Error verificando pago de compra:", err);
    }
    return false;
  };

  const startPurchasePolling = (purchaseRef) => {
    stopPolling();
    checkPurchasePaid(purchaseRef);
    pollingInterval.current = setInterval(() => checkPurchasePaid(purchaseRef), 3000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) clearInterval(pollingInterval.current);
  };

  const qrImageUrl = initPoint
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(initPoint)}`
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
    padding: '1.25rem',
    borderRadius: '1.5rem',
    maxWidth: '400px',
    maxHeight: '92vh',
    overflow: 'auto',
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
          <p className="text-gray-500">
            {paymentDataInput?.turnoId ? "Tu turno ha sido confirmado." : "Tu compra ha sido confirmada."}
            <br />
            Redirigiendo...
          </p>
        </div>
      </div>
    );
  }

  // Si se va a redirigir a MP, mostrar solo el loader mientras tanto
  if (redirectToMP && initPoint) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-[#009EE3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirigiendo a Mercado Pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3">
      <div style={modalStyle} className="bg-white rounded-3xl p-5 max-w-sm w-full text-center shadow-2xl border border-gray-100">
        <button
          onClick={() => onClose(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
        >
          &times;
        </button>

        <div className="mb-2 flex justify-center">
          <div className="bg-blue-50 p-2 rounded-full inline-block">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#009EE3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '28px', height: '28px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-0.5" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Pago con QR</h3>
        <p className="text-gray-500 text-sm mb-3">
          {paymentDataInput?.turnoId
            ? "Escaneá para abonar tu turno"
            : "Escaneá para abonar tu compra"}
        </p>

        {loading ? (
          <div className="py-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#009EE3]"></div>
            <p className="mt-3 text-xs font-bold text-gray-400 uppercase tracking-widest">Generando código...</p>
          </div>
        ) : error ? (
          <div className="py-5 text-red-500 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-sm font-bold">{error}</p>
            <button onClick={() => onClose(false)} className="mt-4 text-xs underline font-bold uppercase tracking-widest text-red-700">Cerrar</button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-white p-2 border-4 border-blue-50 rounded-2xl mb-3 shadow-sm inline-block">
              <img
                src={qrImageUrl}
                alt="QR de Pago"
                style={{ width: '180px', height: '180px', display: 'block' }}
                className="mx-auto rounded-lg"
              />
            </div>

            {paymentDataInput?.turnoId && (
              <p className="text-[10px] text-gray-400 mb-2 px-4 uppercase font-bold tracking-tighter" style={{ fontSize: '11px' }}>
                ID Turno: {paymentDataInput.turnoId}
              </p>
            )}

            {!paymentDataInput?.turnoId && paymentDataInput?.purchaseRef && (
              <p className="text-[10px] text-gray-400 mb-2 px-4 uppercase font-bold tracking-tighter" style={{ fontSize: '11px' }}>
                Ref compra: {paymentDataInput.purchaseRef}
              </p>
            )}

            <div className="flex items-center gap-2 text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
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