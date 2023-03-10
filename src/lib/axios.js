import Axios from "axios";
import { serverHost } from "../config/serverHost";

const axios = Axios.create({
  baseURL: serverHost.product,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  //   withCredentials: true,
});

export default axios;
