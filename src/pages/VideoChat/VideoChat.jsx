import {
    AgoraVideoPlayer,
    createClient,
    createMicrophoneAndCameraTracks,
    ClientConfig,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
  } from "agora-rtc-react";
import { useState } from "react";
import VideoCall from "../../components/Video/VideoCall";
import ChannelForm from "../ChannelForm/ChannelForm";

export default function VideoChat() {
    const [inCall, setInCall] = useState(false);
    const [channelName, setChannelName] = useState("");

    return (
        <div>
      <h1 className="heading">Agora RTC NG SDK React Wrapper</h1>
      {inCall ? (
        <VideoCall setInCall={setInCall} channelName={channelName} />
      ) : (
        <ChannelForm setInCall={setInCall} setChannelName={setChannelName} />
      )}
    </div>
    )

}
