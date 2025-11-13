import Swal from "sweetalert2";

const Alert = ({ 
  Title = "Alerta", 
  Detail = "Ooohh what button you gonna click?", 
  Confirm = "Confirm it!", 
  Cancel = "Maybe not" 
}) => {
  return Swal.fire({
    title: Title,
    text: Detail,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: Confirm,
    cancelButtonText: Cancel,
    allowOutsideClick: false,
    reverseButtons: true,
  });
};

export default Alert;
