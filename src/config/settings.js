import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "204d5522fc35435b8d5576f15d813055";

export const config = {
  mode: "live",
  codec: "h264",
  appId,
  token: null,
  role: "host",
};
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
