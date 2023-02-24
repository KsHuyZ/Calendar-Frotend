import axios from "../lib/axios";

export const notifyApi = {
  getNotifiesbyUserId: async (id) => {
    try {
      const res = await axios.get(`/notify/${id}`);
      return res.data.notifies;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  seenNotify: async (id) => {
    try {
      const res = await axios.post(`/notify/${id}`);
      return res.data.success;
    } catch (error) {
      return false;
    }
  },
};
