import { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import LoadingBar from "react-top-loading-bar";
// import socket from "../config/socket";
import io from "socket.io-client";
import { serverHost } from "../config/serverHost";
import { notfifyError, notifyOffline, notifySuccess } from "../lib/toastify";

const Socket = io.connect(serverHost.local);

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0);
  const [socket, setSocket] = useState(Socket);
  const [status, setStatus] = useState(window.navigator.onLine);
  const { getUserbyEmail } = userApi;
  const auth = getAuth();
  const navigate = useNavigate();

  const handleCheckInternetStatus = async () => {
    try {
      const online = await fetch(
        "https://jsonplaceholder.typicode.com/todos/1"
      );
      if (online.status >= 200 && online.status < 300) {
        if (!status) {
          setStatus(true);
          return notifySuccess("Online");
        }
      } // either true or false
    } catch (err) {
      if (status) {
        notifyOffline();
        return setStatus(false);
      }

      // definitely offline
    }
  };

  useEffect(() => {
    if (!Socket.connected) {
      handleCheckInternetStatus();
    }
  }, [Socket]);

  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged(async (user) => {
      if (user?.uid) {
        const res = await getUserbyEmail(user.email).then((value) => {
          if (value?._id) {
            const userWithId = Object.assign(user, { id: value?._id });
            localStorage.setItem("accessToken", user.accessToken);
            setUser(userWithId);
            socket.emit("create-user", {
              id: value?._id,
              displayName: value?.displayName,
            });
          }
        });
        return;
      }
      setUser({});
      localStorage.clear();
      return navigate("/login");
    });

    return () => {
      unsubcribed();
    };
  }, [auth, socket]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setProgress,
        socket,
        progress,
        handleCheckInternetStatus,
        status,
      }}
    >
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {children}
    </AuthContext.Provider>
  );
}
