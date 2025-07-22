import { createServer } from "http";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { makeExecutableSchema } from "@graphql-tools/schema";
import gql from "graphql-tag";
import { PubSub } from "graphql-subscriptions";
import { execute, subscribe } from "graphql";

const typeDefs = gql`
  type Message {
    id: ID!
    content: String!
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
      subscribe: () => pubsub.asyncIterator([MESSAGE_ADDED]),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

// WebSocket server
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

useServer(
  {
    schema,
    execute,
    subscribe,
    context: async (ctx, msg, args) => {
      console.log("WebSocket context:", { ctx, msg });
      return { pubsub };
    },
    onConnect: (ctx) => {
      console.log("Client connected to WebSocket:", ctx.connectionParams);
    },
    onSubscribe: (ctx, msg) => {
      console.log("Client subscribed:", msg.payload.query);
    },
    onDisconnect: () => {
      console.log("Client disconnected from WebSocket");
    },
    onClose: () => {
      console.log("WebSocket connection closed");
    },
    keepAlive: 10000, // Send keep-alive ping every 10 seconds
  },
  wsServer,
);

const apolloServer = new ApolloServer({ schema });

await apolloServer.start();

app.use("/graphql", cors(), bodyParser.json(), expressMiddleware(apolloServer));

httpServer.listen(4000, () => {
  console.log("🚀 Query endpoint: http://localhost:4000/graphql");
  console.log("🚀 Subscriptions endpoint: ws://localhost:4000/graphql");
});
