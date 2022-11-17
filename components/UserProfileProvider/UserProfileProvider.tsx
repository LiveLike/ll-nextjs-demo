import { createContext, useState, useContext, useEffect } from "react";
import { initApi, IUserProfile } from "@livelike/engagement-api";

const UserProfileContext = createContext<IUserProfile | null>(null);

export const useUserProfile = () => {
  return useContext(UserProfileContext);
};

export const UserProfileProvider = ({ children, profile }) => {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  useEffect(() => {
    async function initLL() {
      return initApi({
        endpoint: "https://cf-blast-dig.livelikecdn.com/api/v1/",
        clientId: "lom9db0XtQUhOZQq1vz8QPfSpiyyxppiUVGMcAje",
        accessToken: profile.access_token,
      });
    }
    initLL().then((_profile) => {
      setUserProfile(_profile);
    });
  }, []);

  return (
    <UserProfileContext.Provider value={userProfile}>
      {children}
    </UserProfileContext.Provider>
  );
};
