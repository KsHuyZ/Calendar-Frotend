import axios from "../lib/axios";
const calendarRoute = "calendar";

export const calendarApi = {
  createCalendar: async (calendarName, description, imagePreview, ownerId) => {
    const formData = new FormData();
    formData.append("calendarName", calendarName);
    formData.append("description", description);
    formData.append("file", imagePreview);
    formData.append("ownerId", ownerId);
    const res = await axios.post(
      `/${calendarRoute}/create-calendar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data.calendar;
  },
};
