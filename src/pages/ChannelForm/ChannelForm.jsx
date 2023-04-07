import {config} from "../../config/settings"
const ChannelForm = ({
    setInCall,
    setChannelName
  }) => {
  
    return (
      <form className="join">
      {config.appId === '' && <p style={{color: 'red'}}>Please enter your Agora App ID in App.tsx and refresh the page</p>}
        <input type="text"
          placeholder="Enter Channel Name"
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button onClick={(e) => {
          e.preventDefault();
          setInCall(true);
        }}>
          Join
        </button>
      </form>
    );
  };
  
  export default ChannelForm;