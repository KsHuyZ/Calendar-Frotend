import axios from "../lib/axios";
import { notfifyError, notifySuccess } from "../lib/toastify";

export const userApi = {
  authByGoogle: async (uid, displayName, email, photoURL) => {
    try {
      const res = await axios.post("/user/gg-auth", {
        uid,
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
  getUserbyUid: async (uid) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await axios.get(`/user/by-uid/${uid}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return res.data.user;
    } catch (error) {
      console.log(error);
      return null;
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
  getCalendarbyUserId: async (id, signal) => {
    try {
      const res = await axios.get(`/user/calendar/${id}`, {
        signal,
      });
      return res.data.calendar;
    } catch (error) {
      console.log(error);
      // return null;
    }
  },
  getUserListbyEmail: async (email) => {
    try {
      const res = await axios.get(`/user/find-email/${email}`);
      return res.data.users;
    } catch (error) {
      console.log(error);
    }
  },
};
