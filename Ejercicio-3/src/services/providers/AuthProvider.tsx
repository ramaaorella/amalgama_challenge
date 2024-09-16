import { createContext, ReactNode, useContext, useState } from "react";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext)
    throw new Error("useAuth must be used within an AuthProvider");

  return authContext;
};

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoggedIn: boolean;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );

  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("authToken", newToken);
    } else {
      localStorage.removeItem("authToken");
    }
    setToken(newToken);
  };

  const isLoggedIn = token !== null;

  return (
    <AuthContext.Provider
      value={{ token, setToken: handleSetToken, isLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
};
