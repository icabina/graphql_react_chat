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
    await sendMessage({ variables: { content } });
    setContent("");
  };

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
        {allMessages.map((msg: any) => (
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
