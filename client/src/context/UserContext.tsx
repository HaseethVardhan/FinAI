import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface UserContextProps {
  children: ReactNode;
}

type User = { id?: string; } | null;

interface ContextInterface {
    user: User;
    setuser: React.Dispatch<React.SetStateAction<User>>;
}

export const UserDataContext = createContext<ContextInterface | undefined>(undefined);

const UserContext: React.FC<UserContextProps> = ({ children }) => {
  const [user, setuser] = useState<User>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setuser(JSON.parse(user));
    }
  }, []);

  return (
    <>
      <UserDataContext.Provider
        value={{
          user,
          setuser,
        }}
      >
        {children}
      </UserDataContext.Provider>
    </>
  );
};

export default UserContext;
