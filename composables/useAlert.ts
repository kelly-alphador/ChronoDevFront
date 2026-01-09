import Swal from "sweetalert2";

export function useAlert() {
  function success(message: string) {
    return Swal.fire({
      icon: "success",
      title: "Succès",
      text: message,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  function error(message: string) {
    return Swal.fire({
      icon: "error",
      title: "Erreur",
      text: message,
    });
  }

  function confirm(message: string) {
    return Swal.fire({
      icon: "warning",
      title: "Confirmation",
      text: message,
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    });
  }

  function toast(message: string, icon: "success" | "error" | "info" | "warning") {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });

    return Toast.fire({
      icon,
      title: message,
    });
  }
    function toastDetails(message: string) {
    const Toast = Swal.mixin({
      icon:"info",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
    });

    return Toast.fire({
      title: message,
    });
  }
  return { success, error, confirm, toast, toastDetails };
}
