import axios from "../lib/axios";
const eventRoute = "event";

export const eventApi = {
  getEventbyId: async (id) => {
    try {
      const res = await axios.get(`/${eventRoute}/${id}`, {});
      return res.data.event;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  userAcceptJointoEvent: async (idNotify, id, idUser) => {
    try {
      const res = await axios.post(`/${eventRoute}/${id}`, {
        idUser,
        idNotify,
      });
      return res.data.success;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  getEventbyCalendarId: async (id, year) => {
    try {
      const res = await axios.get(`${eventRoute}/${id}/${year}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
