import socket from "../config/socket";
import axios from "../lib/axios";
import { notfifyError, notifySuccess } from "../lib/toastify";

export const userApi = {
  authByGoogle: async (displayName, email, photoURL) => {
    try {
      const res = await axios.post("/user/gg-auth", {
        displayName,
        email,
        photoURL,
      });
      const { data } = res;
      if (data.success) {
        notifySuccess("Login success");
        return true;
      }
      // socket.emit("");
    } catch (error) {
      notfifyError("Login fail");
    }
  },
  getUserbyEmail: async (email) => {
    try {
      const res = await axios.get(`/user/by-email/${email}`);
      return res.data.user;
    } catch (error) {
      console.log(error);
    }
  },
  getUserbyId: async (id) => {
    try {
      const res = await axios.get(`/user/by-id/${id}`);
      return res.data.user;
    } catch (error) {
      return error;
    }
  },
  getSchedudulesbyUserId: async (id) => {
    try {
      const res = await axios.get(`/user/schedule/${id}`);
      return res.data.schedule;
    } catch (error) {
      console.log(error);
    }
  },
};
