import Swal from "sweetalert2";

const Alert = ({ Title = "Alerta", Detail = "Ooohh what button you gonna click?", Confirm = "Confirm it!", Cancel = "Maybe not" }) => {
    Swal.fire({
        title: Title,
        text: Detail,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: Confirm,
        cancelButtonText: Cancel,
    });

    return null; // No necesitas renderizar nada
};

export default Alert;


/*

Se implementa asi:
        onClick={() =>
            Alert({
                Title: "Disponibilidad",
                Detail: "¿Estás seguro de que quieres continuar?",
                Confirm: "Sí",
                Cancel: "No",
            })
        }
*/