import { Grid } from "@mui/material";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { useEffect, useState } from "react";

const Videos = ({
    users,
    tracks
}) => {

    const [gridSpacing, setGridSpacing] = useState(12);

    useEffect(() => {
        setGridSpacing(12/(users.length+1));
    }, [users, tracks]);

    return (
            <Grid item xs={24} style={{height: "100%"}} container spacing={gridSpacing}>
                <Grid item xs={gridSpacing} style={{height: "100%"}}>
                    <AgoraVideoPlayer className='vid' videoTrack={tracks[1]} style={{ height: "100%", width:"100%"}} />
                </Grid>
                {users.length > 0 &&
                    users.map((user) => {
                        if (user.videoTrack) {
                            return (
                                <Grid item xs={gridSpacing}  style={{height: "100%"}}>
                                    <AgoraVideoPlayer
                                        videoTrack={user.videoTrack}
                                        key={user.uid}
                                        className="vid"
                                        style={{ height: "100%" }}
                                    />
                                </Grid>
                            );
                        } else return null;
                    })}
            </Grid>
    );
};

export default Videos