// --------------------------------------------------------------------
// Apollo Server
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import { express } from "express";
import cors from "cors";
import bodyParse from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "graphql-tag";
import { PubSub } from "graph-subscriptions";

const typeDeft = gql`
  type Message {
    id: ID!
    content: string!
  }
  type Query {
    messages: [Message!]!
  }

  type Mutation {
    sendMessage(content: String!): Message!
  }

  type Subscription {
    messageAdded: Message!
  }
`;

const messages = [];
const pubsub = new PubSub();
const MESSAGE_ADDED = "MESSAGE_ADDED";

const resolvers = {
  Query: {
    messages: () => messages,
  },
  Mutation: {
    sendMessage: (_, { content }) => {
      const message = { id: Date.now().toString(), content };
      messages.push(message);
      pubsub.publish(MESSAGE_ADDED, { messageAdded: message });
      return message;
    },
  },
  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

//websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer({ schema }, wsServer);

const apolloServer = new ApolloServer({ schema });

await apolloServer.start();

app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(apolloServer));

httpServer.listen(4000, () => {
  console.log("read");
});
// --------------------------------------------------------------------
// Apollo client

import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilites";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  }),
);

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return (
      def.kind === "OperationDefinition" && def.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

// --------------------------------------------------------------------

import { gql } from "@apollo/client";

export const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!) {
    sendMessage(content: $content) {
      id
      content
    }
  }
`;

export const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
    }
  }
`;

export const MESSAGE_ADDED = gql`
  subscription {
    messageAdded {
      id
      content
    }
  }
`;

// --------------------------------------------------------------------

import React, { useState } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MESSAGES } from "../graphql/queries/getMessages";
import { SEND_MESSAGE } from "../graphql/mutations/sendMessage";
import { MESSAGE_ADDED } from "../graphql/subscriptions/messageAdded";

const Chat = () => {
  const { data } = useQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const { data: subData } = useSubscription(MESSAGE_ADDED);
  const [content, setContent] = useState("");

  const allMessages = subData
    ? [...(data?.messages || []), subData.messageAdded]
    : data?.messages || [];

  const handleSend = async () => {
    if (!content.trim()) return;
    await sendMessage({
      variables: { content },
    });
    setContent("");
  };

  return (
    <div>
      <div>
        {allMessages.mag((msg: {id: Number content: string}) => (
          <div key={msg.id}>{msg.content}</div>
        ))}

        <input value={content} onChange={(e) => setContent(e.target.value)}/>

      </div>
      <button onClick={handleSend}>Send</button>
    </div>
  )
};
