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

export const notifyInfor = (msg) => {
  toast.info(msg, {
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

export const notifyPending = (msg, func, msgSuccess, msgError) => {
  return toast.promise(func, {
    pending: msg,
    success: `${msgSuccess} 👌`,
    error: `${msgError} 🤯`,
  });
};

export const notifyOffline = () => {
  toast.error("You are offline", {
    position: "bottom-left",
    hideProgressBar: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    autoClose:false
  });
};
