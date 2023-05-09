import axios from "../lib/axios";

const baseURL = "event-attentee";

const eventAttenteeApi = {
  getCommingEvents: async (userId) => {
    try {
      const res = await axios.post(`/${baseURL}/get-upcoming-event`, {
        userId,
      });
      return res.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
export default eventAttenteeApi;
