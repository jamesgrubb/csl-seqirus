import type { Video } from "../../shared/types";
import { formatDuration } from "../api";
import { PlayIcon } from "./Icons";

// Placeholder art (warm stone + CSL angles) until a poster still is uploaded to R2.
// Each category gets its own composition so the grid doesn't look repetitive.
const VARIANTS: Record<string, string> = {
  science: "a",
  manufacturing: "b",
  preparedness: "c",
  people: "d",
};

interface Props {
  video: Video;
  large?: boolean;
  angled?: boolean;
  showPlay?: boolean;
}

export function Thumbnail({ video, large = false, angled = true, showPlay = true }: Props) {
  const variant = VARIANTS[video.category ?? ""] ?? "a";
  return (
    <div className={`thumb${large ? " thumb--large" : ""}${angled ? " thumb--angled" : ""}`}>
      {video.posterUrl ? (
        <img src={video.posterUrl} alt="" loading="lazy" />
      ) : (
        <div className={`art art--${variant}`} aria-hidden="true">
          <span className="art__plane art__plane--1" />
          <span className="art__plane art__plane--2" />
          <span className="art__plane art__plane--3" />
        </div>
      )}
      {showPlay && (
        <span className="thumb__play" aria-hidden="true">
          <PlayIcon size={large ? 30 : 18} />
        </span>
      )}
      {video.durationSeconds ? <span className="thumb__duration">{formatDuration(video.durationSeconds)}</span> : null}
    </div>
  );
}
