import { WebSocket } from "ws";

const ws = new WebSocket("ws://127.0.0.1:4000/graphql");

ws.on("open", () => {
  console.log("Connected");
  ws.send(JSON.stringify({ type: "connection_init" }));
});
ws.on("message", (data) => console.log("Received:", data.toString()));
ws.on("ping", () => console.log("Received ping"));
ws.on("pong", () => console.log("Received pong"));
ws.on("close", (code, reason) =>
  console.log("Closed:", { code, reason: reason.toString() }),
);
ws.on("error", (err) => console.error("Error:", err));
