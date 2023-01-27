import { createContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/userApi";
import LoadingBar from "react-top-loading-bar";
export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [progress, setProgress] = useState(0);
  const { getUserbyEmail } = userApi;
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubcribed = auth.onIdTokenChanged(async (user) => {
      if (user?.uid) {
        const res = await getUserbyEmail(user.email).then((value) => {
          if (value?._id) {
            const userWithId = Object.assign(user, { id: value?._id });
            localStorage.setItem("accessToken", user.accessToken);
            setUser(userWithId);
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
  }, [auth]);

  return (
    <AuthContext.Provider value={{ user, setUser, setProgress }}>
      <LoadingBar
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {children}
    </AuthContext.Provider>
  );
}
