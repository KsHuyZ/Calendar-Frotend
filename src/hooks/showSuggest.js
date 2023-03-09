import axios from "axios";
import React from "react";
import { mapApiKey } from "../config/serverHost";

const showSuggest = async (value) => {
  try {
    const res = await axios.get(
      `https://rsapi.goong.io/Place/AutoComplete?input=${value}&api_key=${mapApiKey}`
    );

    return res.data.predictions;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default showSuggest;
