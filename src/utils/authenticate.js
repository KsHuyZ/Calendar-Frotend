import { userApi } from "../api/userApi";
import { getAuth } from "../firebase/config";

const authenticate = async (accessToken) => {
  const auth = getAuth();
  const { getUserbyUid, authorize } = userApi;
  let user = null;

  if (accessToken) {
    // Call your API to authenticate with JWT
    const handleAuth = async () => {
        const res = await authorize();
        if (res.status === 200) {
            const data = res.data
            user = data.user;
          }
      };

   
  } else {
    // Check Firebase Auth state
    const currentUser = auth.currentUser;
    if (currentUser) {
      const { displayName, email, uid } = currentUser;
      user = { displayName, email, uid };
    }
  }

  return user;
};

export default authenticate;
