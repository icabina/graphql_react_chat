import { useEffect, useRef, useState } from "react";

const IMAGES = Array.from({ length: 30 }, (_, i) => `./src/images/photo-${i + 1}.avif`);

export default function ImageGrid() {
  const [visibleCount, setVisibleCount] = useState(9);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // This fires when the element enters the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisibleCount((prev) => prev + 6);
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0,
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <div className="grid">
        {IMAGES.slice(0, visibleCount).map((src, index) => (
          <img key={index} src={src} alt={`photo-${index}`} />
        ))}
      </div>

      {/* 
      Sentinel 
      This invisible div is what triggers loading more images.
      */}

      <div ref={loaderRef} style={{ height: "50px" }} />
    </div>
  );
}
