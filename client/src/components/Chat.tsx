import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client";
import { gql } from "@apollo/client";

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

const Chat = () => {
  const { data, loading, error } = useQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const { data: subData, error: subError } = useSubscription(MESSAGE_ADDED);
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState<{ id: string; content: string }[]>(
    [],
  );

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: "1rem" }}>
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
      </div>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Chat;
