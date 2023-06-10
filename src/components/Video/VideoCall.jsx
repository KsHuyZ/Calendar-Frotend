import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import { useState, useEffect, useRef } from "react";
import { useClient, useMicrophoneAndCameraTracks } from "../../config/settings"
import { Controls } from "../Controlls/Controls";
import Videos from "../Videos/Videos";
import { config } from "../../config/settings"
import { Grid } from "@mui/material";

export default function VideoCall({ setInCall, channelName }) {
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  useEffect(() => {
    // function to initialise the SDK
    let init = async (name) => {
      console.log("init", name);
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          console.log("audio type");
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        console.log("leaving", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      await client.join(config.appId, name, config.token, null);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);

    };

    if (ready && tracks) {
      console.log("init ready");
      init(channelName);
    }

  }, [channelName, client, ready, tracks]);

  return (
    <Grid container direction="column" style={{ height: "100%", width:"100%", justifyContent:"space-between" }}>
      <Grid item style={{ height: "5%" }}>
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </Grid>
      <Grid item style={{ height: "90%", width:"100%" }}>
        {start && tracks && <Videos users={users} tracks={tracks} />}
      </Grid>
    </Grid>
  );

}
