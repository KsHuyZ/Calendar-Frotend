import socket from "../config/socket";
import axios from "../lib/axios";
import { notfifyError, notifyPending, notifySuccess } from "../lib/toastify";

export const eventApi = {
  createEvent: async (
    title,
    idSchedule,
    backgroundColor,
    description,
    start,
    end,
    createdBy
  ) => {
    try {
      const res = await axios.post("/event/create-event", {
        title,
        idSchedule,
        backgroundColor,
        description,
        start,
        end,
        createdBy,
      });
      return res.data;
    } catch (error) {
      
      return false;
    }
  },
  updateTimeEvent: async (_id, start, end) => {
    try {
      const res = await axios.post("/event/update-time-event", {
        _id,
        start,
        end,
      });
      return res.data.success;
    } catch (error) {
      return false;
    }
  },
  deleteEvent: async (id) => {
    try {
      await axios.delete(`/event/${id}`);
    } catch (error) {
      console.log(error);
    }
  },
};
