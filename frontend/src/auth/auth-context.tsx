import { createContext, useContext, useState, type ReactNode } from "react";
import { useApolloClient } from "@apollo/client/react";
import { getToken, removeToken, saveToken } from "./token";

type AuthContextValue = {
  isAuthenticated: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [token, setToken] = useState(getToken);

  function signIn(newToken: string) {
    saveToken(newToken);
    setToken(newToken);
  }

  function signOut() {
    removeToken();
    setToken(null);
    client.clearStore();
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(token), signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro de AuthProvider");
  return context;
}
