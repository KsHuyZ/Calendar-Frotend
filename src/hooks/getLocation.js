import axios from "axios";
import React from "react";
import { mapApiKey } from "../config/serverHost";

const getLocation = async (value) => {
  try {
    const res = await axios.get(
      `https://rsapi.goong.io/Place/Detail?placeid=${value}&api_key=${mapApiKey}`
    );
    console.log(res);
    return res.data.result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getLocation;
