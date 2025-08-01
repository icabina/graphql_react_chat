import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

import App from "./App";
//---------------------------------------------------
// Create a WebSocket link
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  }),
);
//---------------------------------------------------
// Create a standard HTTP link
const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});
//---------------------------------------------------
// RESTLINK: npm install apollo-link-rest
const restLink = new RestLink({
  uri: "https://api.example.com/", // Replace with your REST base URL
});
//---------------------------------------------------
// Use split to send subscriptions to wsLink, queries/mutations to httpLink
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" && def.operation === "subscription"
    );
  },
  wsLink,
  // httpLink,
  ApolloLink.from([restLink, httpLink]), // Combine rest + http here
);

//---------------------------------------------------
// Create Apollo client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
);
