import axios from "axios";
import qs from "qs";
export const agoraApi = {
  createTokenRoom: async () => {
    const APP_ID = "35b53915cd404b9fbb9a7538323d99bb";
    const APP_CERTIFICATE = "3d9cdb45776742d0a16793551743e3b5";
    const CHANNEL_NAME = "ahihih";
    const USER_ID = "da7f194e9ed5467eb3241869534c0287";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",

      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    };
    const url = `https://api.agora.io/v1/apps/${APP_ID}/channel/${CHANNEL_NAME}/recording`;
    const config = {
      headers,
      auth: {
        username: APP_ID,
        password: APP_CERTIFICATE,
      },
    };

    const data = qs.stringify({
      cname: CHANNEL_NAME,
      uid: USER_ID,
      clientRequest: JSON.stringify({
        tokenExpiredInSeconds: 3600,
        recordingConfig: {
          channelType: 0,
          transcodingConfig: {},
          subscribeVideoUids: [],
          subscribeAudioUids: [],
          subscribeDataStreamTypes: [],
        },
      }),
    });

    axios
      .post(url, data, config)
      .then((response) => {
        const token = response.data.data;
        console.log(`Channel token: ${token}`);
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
