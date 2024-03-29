import { useState } from "react";
import VideoCall from "../Video/VideoCall";
import ChannelForm from "../../pages/ChannelForm/ChannelForm";
import { useParams } from "react-router-dom";
import "./videochat.scss"
export default function VideoChat() {
  const [inCall, setInCall] = useState(false);
  // const [channelName, setChannelName] = useState("");
  const { channelName } = useParams()
  return (
    <div className="meeting-chat">
      <h1 className="heading">Calendar Meeting</h1>
        <VideoCall setInCall={setInCall} channelName={channelName} />
      
    </div>
  )

}
