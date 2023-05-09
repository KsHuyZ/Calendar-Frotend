import axios from "../lib/axios";
import { notfifyError, notifySuccess } from "../lib/toastify";

const userRoute = "user";

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
        return data;
      }
      // socket.emit("");
    } catch (error) {
      notfifyError("Login fail");
    }
  },
  getUserbyUid: async (uid, token) => {
    try {
      const res = await axios.get(`/user/by-uid/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (error) {
      // console.log(error);
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
      // console.log(error);
      // return null;
    }
  },
  getUserListbyEmail: async (email) => {
    try {
      const res = await axios.get(`/user/find-email/${email}`);
      return res.data.users;
    } catch (error) {
      // console.log(error);
      return [];
    }
  },
  registerUser: async (userName, email, password, phoneNumber, file) => {
    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    formData.append("file", file);
    try {
      const res = await axios.post(`/${userRoute}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(res.data);
      if (res.data.success) return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  login: async (email, password) => {
    try {
      const res = await axios.post(`/${userRoute}/login`, {
        email,
        password,
      });
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      notifySuccess("Login success");
      return res.data.user;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  authorize: async () => {
    const res = await axios.get("/auth/authorize");
    return res.data;
  },
};
