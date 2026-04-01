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


/*🧱 What’s actually happening step-by-step
1. You render images + a hidden trigger
<div className="grid">
  { images }
</div>

<div ref={loaderRef} />

That bottom <div> is the sentinel.

👉 Think of it like a tripwire at the bottom of your page.

2. You create an observer
const observer = new IntersectionObserver((entries) => {
  const entry = entries[0];

  if (entry.isIntersecting) {
    // do something
  }
});

👉 This is basically:

“Call me when this element appears in the viewport.”

3. You tell it WHAT to watch
observer.observe(loaderRef.current);

Now the browser starts tracking that element.

👀 What does “intersecting” actually mean?

It means:

The element is visible inside the viewport (even partially)

So when you scroll down and the bottom div becomes visible:

entry.isIntersecting === true

💥 That’s your trigger to load more images.*/
