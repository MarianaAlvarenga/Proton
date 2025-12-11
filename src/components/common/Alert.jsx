import Swal from "sweetalert2";

const Alert = ({ 
  Title = "Alerta", 
  Detail = "Ooohh what button you gonna click?", 
  Confirm = "Confirm it!", 
  Cancel = "Maybe not",
  icon = "warning",       // 👈 agregado
  OnCancel = null 
}) => {
  return Swal.fire({
    title: Title,
    text: Detail,
    icon: icon,            // 👈 reemplaza el warning hardcodeado
    showCancelButton: !!(Cancel && OnCancel),
    confirmButtonText: Confirm,
    cancelButtonText: Cancel,
    allowOutsideClick: false,
    reverseButtons: true,
    // opcional: mostrar el botón de cerrar si querés dar otra forma de salir
    showCloseButton: true,

    didOpen: () => {
      // engancho el botón de cancelar de forma que "capture" prevenga listeners posteriores
      const cancelBtn = Swal.getCancelButton();
      if (!cancelBtn) return;

      const handler = (e) => {
        // Evitar comportamiento por defecto y que otros listeners (incluido el de SweetAlert) se ejecuten
        e.preventDefault();
        e.stopImmediatePropagation();

        // Abrir la pestaña/ventana con el comprobante
        if (OnCancel) {
          try {
            const ret = OnCancel();
            // No hacemos nada con ret; el modal debe permanecer abierto
          } catch (err) {
            console.error("Error en OnCancel:", err);
          }
        } else {
          // fallback
          window.open("about:blank", "_blank");
        }

        // NO cerramos el modal, ni llamamos a Swal.close()
      };

      // Usamos capture=true para interceptar antes que los handlers por defecto
      cancelBtn.addEventListener("click", handler, { capture: true });
    }
  });
};

export default Alert;
