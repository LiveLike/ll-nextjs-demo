import { createContext, useState, useContext, useEffect } from "react";
import { init, IUserProfile } from "@livelike/javascript";

const UserProfileContext = createContext<IUserProfile | null>(null);

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};

export const UserProfileProvider = ({ children, profile }) => {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  useEffect(() => {
    async function initLL() {
      return init({
        endpoint: "https://cf-blast-dig.livelikecdn.com/api/v1/",
        clientId: "lom9db0XtQUhOZQq1vz8QPfSpiyyxppiUVGMcAje",
        accessToken: profile.access_token,
      });
    }
    initLL().then((_profile) => {
      setUserProfile(_profile);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
};
