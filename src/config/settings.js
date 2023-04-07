import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = "35b53915cd404b9fbb9a7538323d99bb";
const token =
  "006902b2e809ca54994ba1af501720d3c0fIACMQnjd3Mmto7F08fdn+kIOkO1sh1WR8GxyXXqdOV7yzWTNKL8AAAAAEAA8g5F5sImxYAEAAQCwibFg";

export const config = { mode: "rtc", codec: "vp8", appId };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main";
