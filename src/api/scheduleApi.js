import socket from "../config/socket";
import axios from "../lib/axios";
import { notfifyError, notifySuccess } from "../lib/toastify";

export const scheduleApi = {
  getSchedulebyUser: async (idSchedule, idUser, year) => {
    try {
      const res = await axios.get(`/schedule/${idSchedule}/${idUser}/${year}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },
};
