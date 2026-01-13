import Swal from "sweetalert2";

const Alert = ({ 
  Title = "Alerta", 
  Detail = "Ooohh what button you gonna click?", 
  Confirm = "Entendido!", 
  Cancel = "Maybe not",
  icon = "warning",
  OnCancel = null 
}) => {
  return Swal.fire({
    title: Title,
    text: Detail,
    icon: icon,

    // 🔹 Confirm sigue igual
    confirmButtonText: Confirm,

    // 🔹 Usamos DENY en vez de CANCEL
    showDenyButton: !!(Cancel && OnCancel),
    denyButtonText: Cancel,
    denyButtonColor: "#6c757d",
    allowOutsideClick: false,
    reverseButtons: true,
    showCloseButton: true,

    // 🧠 Esto evita que el modal se cierre
    preDeny: () => {
      if (OnCancel) {
        try {
          OnCancel();
        } catch (err) {
          console.error("Error en OnCancel:", err);
        }
      }
      return false; // ⛔ NO cerrar modal
    }
  });
};

export default Alert;
