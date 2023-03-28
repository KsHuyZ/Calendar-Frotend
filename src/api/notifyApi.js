import axios from "../lib/axios";
const invitation = "invitation";
export const notifyApi = {
  getNotifiesbyUserId: async (id) => {
    try {
      const res = await axios.get(`/${invitation}/${id}`);
      console.log(res.data);
      return res.data.invitations;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  seenNotify: async (id) => {
    try {
      const res = await axios.post(`/${invitation}/seen`, {
        id,
      });
      return res.data.success;
    } catch (error) {
      return false;
    }
  },
  checkAllNotify: async (id) => {
    try {
      const res = await axios.post(`/${invitation}/check-invitation`, {
        id,
      });
      return res.data.success;
    } catch (error) {
      return false;
    }
  },
};
