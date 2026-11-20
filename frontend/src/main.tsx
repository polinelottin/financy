import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { App } from "./App";
import { AuthProvider } from "./auth/auth-context";
import { apolloClient } from "./lib/apollo";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ApolloProvider>
  </StrictMode>,
);
