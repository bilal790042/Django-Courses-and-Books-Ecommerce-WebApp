import Swal from "sweetalert2";

function toast(){
    const toast = Swal.mixin({
        toast:true,
        position: "top",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,

    })

    return toast
}
export default toast;