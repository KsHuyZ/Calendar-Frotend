import { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import LoadingBar from "react-top-loading-bar";
import socket from "../config/socket";
// import io from "socket.io-client";
import { serverHost } from "../config/serverHost";
import { notfifyError, notifyOffline, notifySuccess } from "../lib/toastify";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0);

  const [status, setStatus] = useState(window.navigator.onLine);
  const { getUserbyUid } = userApi;
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
    socket.on("connect", function () {
      socket.emit("authenticate", {
        token: localStorage.getItem("accessToken"),
      });
    });
    return () => {
      socket.off("connect");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket.connected) {
      handleCheckInternetStatus();
    }
  }, [socket]);

  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged(async (user) => {
      if (user?.uid) {
        localStorage.setItem("accessToken", user.accessToken);
        const res = await getUserbyUid(user.uid);
        if (res?._id) {
          setUser(res);
          socket.emit("create-user", {
            id: res?._id,
            userName: res?.userName,
            photoURL: res?.photoURL,
          });
        }
        return;
      }
      setUser({});
      localStorage.clear();
      return navigate("/login");
    });

    return () => {
      unsubcribed();
    };
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setProgress,
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
