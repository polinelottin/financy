import { ApolloClient, ApolloLink, CombinedGraphQLErrors, HttpLink, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { getToken, removeToken } from "@/auth/token";

const authLink = new SetContextLink(({ headers }) => {
  const token = getToken();
  return { headers: { ...headers, ...(token && { authorization: `Bearer ${token}` }) } };
});

const expiredSessionLink = new ErrorLink(({ error }) => {
  const unauthenticated =
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.code === "UNAUTHENTICATED");

  if (unauthenticated && getToken()) {
    removeToken();
    window.location.assign("/");
  }
});

const httpLink = new HttpLink({ uri: `${import.meta.env.VITE_BACKEND_URL}/graphql` });

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([expiredSessionLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});
