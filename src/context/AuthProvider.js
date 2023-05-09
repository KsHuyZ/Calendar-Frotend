import { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import LoadingBar from "react-top-loading-bar";
import socket from "../config/socket";
// import io from "socket.io-client";

import { notifyOffline, notifySuccess } from "../lib/toastify";
import isEmpty from "../utils/isEmptyObj";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(window.navigator.onLine);
  const { authorize } = userApi;
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

  const handleGetUser = async () => {
    const res = await authorize();
    if (res) {
      setUser(res.user);
      return;
    }
    setUser({});
    localStorage.clear();
    return navigate("/login");
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
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      handleCheckInternetStatus();
    });
    return () => {
      socket.off("disconnect");
    };
  }, [socket]);

  useEffect(() => {
    handleGetUser();
  }, []);

  useEffect(() => {
    if (!isEmpty(user)) {
      socket.emit("create-user", {
        id: user._id,
        userName: user.userName,
        photoURL: user.photoURL,
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setProgress,
        progress,
        handleCheckInternetStatus,
        status,
        auth,
        // setIsLogin()
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
