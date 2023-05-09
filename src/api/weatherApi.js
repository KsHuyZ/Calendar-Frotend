// https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
import axios from "axios";
import { weatherKey } from "../config/serverHost";

const weatherApi = async (lat, lon) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherKey}`
  );
  return res.data;
};
export default weatherApi;
