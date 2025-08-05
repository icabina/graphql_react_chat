import Draggable from "./Draggable";

export default function DraggablePage() {
  return (
    <div className="container flex">
      <div className="content">
        <div style={{ position: "relative" }}>
          <h1>Drag & Drop</h1>
          <Draggable />
        </div>
      </div>
    </div>
  );
}
