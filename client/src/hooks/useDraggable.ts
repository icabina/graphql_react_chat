import { useEffect } from "react";

export default function useDraggable(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let translateX = 0;
    let translateY = 0;
    let animationFrameId: number | null = null;

    const updatePosition = () => {
      if (el) {
        el.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
      }
      animationFrameId = null; // Mark ready for next frame
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      isDragging = true;

      startX = e.clientX - translateX;
      startY = e.clientY - translateY;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      currentX = e.clientX;
      currentY = e.clientY;

      translateX = currentX - startX;
      translateY = currentY - startY;

      // Only request new animation frame if one isn't already pending
      if (animationFrameId === null) {
        animationFrameId = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    el.addEventListener("mousedown", handleMouseDown);

    return () => {
      el.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [ref]);
}
