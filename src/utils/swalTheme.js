import Swal from "sweetalert2";

export const showSuccess = (theme, message) => {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: message,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    confirmButtonColor: "#d74315",
    didOpen: () => {
      const container = document.querySelector(".swal2-container");
      if (container) {
        container.style.zIndex = "9999";
      }
    },
  });
};

export const showError = (theme, message) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    confirmButtonColor: "#d74315",
    didOpen: () => {
      const container = document.querySelector(".swal2-container");
      if (container) {
        container.style.zIndex = "9999";
      }
    },
  });
};

export const getSwalTheme = (theme) => ({
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  confirmButtonColor: theme.palette.primary.main,
  cancelButtonColor: theme.palette.grey[500],
});
