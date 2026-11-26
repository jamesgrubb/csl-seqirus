import { useEffect, useState } from "react";

const SRC = "/video/hero.mp4"; // 1152×768, 8s loop, no audio (original in media-src/)
const POSTER = "/video/hero-poster.webp";

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Looping, muted background film for the hero. Shows a still instead when the visitor prefers less motion. */
export function HeroVideo() {
  const [still, setStill] = useState(reducedMotion);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setStill(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="hero-video" aria-hidden="true">
      {still ? (
        <img src={POSTER} alt="" />
      ) : (
        <video src={SRC} poster={POSTER} autoPlay muted loop playsInline preload="auto" />
      )}
    </div>
  );
}
