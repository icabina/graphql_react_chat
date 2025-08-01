import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { gql } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!) {
    sendMessage(content: $content) {
      id
      content
    }
  }
`;

const GET_MESSAGES = gql`
  query {
    messages {
      id
      content
    }
  }
`;

const MESSAGE_ADDED = gql`
  subscription {
    messageAdded {
      id
      content
    }
  }
`;

type Message = { id: string; content: string };
type MessagesQueryResult = { messages: Message[] };

const Graphql = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data, loading, error } = useQuery(GET_MESSAGES);

  // If you want to rely on Apollo's cache instead of maintaining messages
  // in local state, you can let the cache auto-update with:
  const [sendMessage] = useMutation(SEND_MESSAGE, {
    optimisticResponse: (variables: { content: string }) => ({
      sendMessage: {
        __typename: "Message",
        id: uuidv4(),
        //id: Date.now().toString(),
        content: variables.content,
      },
    }),
    //instance of inMemoryCache, and result of mutation
    update: (cache, { data: { sendMessage } }) => {
      const existing = cache.readQuery<MessagesQueryResult>({
        query: GET_MESSAGES,
      });

      if (!existing) return;
      if (existing?.messages.some((m) => m.id === sendMessage.id)) return;

      cache.writeQuery({
        query: GET_MESSAGES,
        data: {
          messages: [...existing.messages, sendMessage],
        },
      });
    },
  });

  const { data: subData, error: subError } = useSubscription(MESSAGE_ADDED);

  //scroll to bottom of messages to newest
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load initial messages
  useEffect(() => {
    if (data?.messages) {
      setMessages(data.messages);
    }
  }, [data]);

  // Handle subscription updates
  useEffect(() => {
    if (subData?.messageAdded) {
      setMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some((msg) => msg.id === subData.messageAdded.id)) {
          return prev;
        }
        return [...prev, subData.messageAdded];
      });
    }
  }, [subData]);

  // Log subscription errors
  useEffect(() => {
    if (subError) {
      console.error("Subscription error:", subError);
    }
  }, [subError]);

  const handleSend = async () => {
    if (!content.trim()) return;
    try {
      await sendMessage({ variables: { content } });
      setContent("");
    } catch (err) {
      console.error("Mutation error:", err);
    }
  };

  if (loading)
    return (
      <div className="container flex">
        <div className="content">
          <p>Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="container flex">
        <div className="content">
          <p>Error: {error.message}</p>
        </div>
      </div>
    );

  return (
    <div className="container flex">
      <div className="content">
        <h1 style={{ marginBottom: "20px" }}>GraphQL Instant Messages</h1>
        <div
          style={{
            height: "300px",
            overflowY: "auto",
            border: "1px solid gray",
            marginBottom: "1rem",
          }}
        >
          {messages.map((msg) => (
            <div key={msg.id}>{msg.content}</div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <div>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message"
              type="text"
            />
          </div>
          <div>
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Graphql;

/*
Debounce duplicate checks (optional)
The check for duplicate messages in both the mutation update and the subscription is good, but in high-frequency environments (like chat rooms), consider using a Set or Map to track existing IDs for O(1) lookup. This is a micro-optimization.
*/
