import { Grid } from "@mui/material";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { useEffect, useState } from "react";

const Videos = ({
    users,
    tracks
}) => {

    const [gridSpacing, setGridSpacing] = useState(12);

    useEffect(() => {
        setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
    }, [users, tracks]);

    return (
            <Grid item xs={gridSpacing}>
                <Grid item xs={gridSpacing}>
                    <AgoraVideoPlayer className='vid' videoTrack={tracks[1]} style={{ height: "100%", width: "100%" }} />
                </Grid>
                {users.length > 0 &&
                    users.map((user) => {
                        if (user.videoTrack) {
                            return (
                                <Grid item xs={gridSpacing}>
                                    <AgoraVideoPlayer
                                        videoTrack={user.videoTrack}
                                        key={user.uid}
                                        style={{ height: "100%", width: "100%" }}
                                    />
                                </Grid>
                            );
                        } else return null;
                    })}
            </Grid>
    );
};

export default Videos