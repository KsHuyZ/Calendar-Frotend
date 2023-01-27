import { toast } from "react-toastify";

export const notifySuccess = (msg) =>
  toast.success(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
export const notfifyError = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

// const resolveAfter3Sec = new Promise((resolve) => setTimeout(resolve, 3000));
export const notifyPending = (msg, msgSuccess, msgError, func) => {
  toast.promise(func, {
    pending: msg,
    success: `${msgSuccess} 👌`,
    error: `${msgError} 🤯`,
  });
};
