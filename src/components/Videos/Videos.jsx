import { AgoraVideoPlayer } from "agora-rtc-react";

const Videos = ({
    users,
    tracks
}) => {
    return (
        <div>
            <div id="videos">
                <AgoraVideoPlayer className='vid' videoTrack={tracks[1]} style={{ height: '95%', width: '95%' }} />
                {users.length > 0 &&
                    users.map((user) => {
                        if (user.videoTrack) {
                            return (
                                <AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} style={{ height: '95%', width: '95%' }} key={user.uid} />
                            );
                        } else return null;
                    })}
            </div>
        </div>
    );
};

export default Videos