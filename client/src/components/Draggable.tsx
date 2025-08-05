import { useRef } from "react";
import useDraggable from "../hooks/useDraggable";

export default function Draggable() {
  const ref = useRef<HTMLDivElement>(null);
  useDraggable(ref);

  return (
    <div
      ref={ref}
      style={{
        width: 120,
        height: 120,
        backgroundColor: "#3b82f6",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        cursor: "grab",
        userSelect: "none",
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        position: "absolute", // allow absolute positioning if needed
        left: 0,
        top: 0,
      }}
    >
      Drag me
    </div>
  );
}
