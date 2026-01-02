import Swal from "sweetalert2";

const Alert = ({ 
  Title = "Alerta", 
  Detail = "Ooohh what button you gonna click?", 
  Confirm = "Confirm it!", 
  Cancel = "Maybe not",
  icon = "warning",
  OnCancel = null 
}) => {
  return Swal.fire({
    title: Title,
    text: Detail,
    icon: icon,
    showCancelButton: !!(Cancel && OnCancel),
    confirmButtonText: Confirm,
    cancelButtonText: Cancel,
    allowOutsideClick: false,
    reverseButtons: true,
    showCloseButton: true,

    didOpen: () => {
      const cancelBtn = Swal.getCancelButton();
      if (!cancelBtn) return;

      const handler = () => {
        // Ejecutar lógica custom si existe
        if (OnCancel) {
          try {
            OnCancel();
          } catch (err) {
            console.error("Error en OnCancel:", err);
          }
        }
        // ⚠️ NO prevenimos el evento
        // SweetAlert se encarga de cerrar el modal
      };

      cancelBtn.addEventListener("click", handler, { capture: true });
    }
  });
};

export default Alert;
