import { useEffect, useState } from "react";
import type { Video, VideoListResponse } from "../../shared/types";
import { fetchVideo, formatDuration } from "../api";
import { Editable, useEdit } from "../edit";
import { linkProps } from "../router";
import { ArrowLeftIcon } from "./Icons";
import { Thumbnail } from "./Thumbnail";

export function WatchPage({ slug, library }: { slug: string; library: VideoListResponse | null }) {
  const cached = library?.videos.find((v) => v.slug === slug) ?? null;
  const [video, setVideo] = useState<Video | null>(cached);
  const [notFound, setNotFound] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const { editor, saveVideo } = useEdit();

  // Reset only when the video changes; library refreshes (e.g. after an edit) must not hide a playback error.
  useEffect(() => setPlaybackError(false), [slug]);

  useEffect(() => {
    setNotFound(false);
    if (cached) return setVideo(cached);
    fetchVideo(slug).then(setVideo, () => setNotFound(true));
  }, [slug, cached]);

  const related = (library?.videos ?? [])
    .filter((v) => v.slug !== slug)
    .sort((a, b) => Number(b.category === video?.category) - Number(a.category === video?.category))
    .slice(0, 4);

  if (notFound) {
    return (
      <div className="container empty empty--page">
        <h1>Video not found</h1>
        <a className="text-link" {...linkProps("/")}>Back to the campaign</a>
      </div>
    );
  }

  return (
    <>
      <section className="player-band">
        <div className="container">
          <a className="back-link" {...linkProps("/")}>
            <ArrowLeftIcon size={16} /> Back to the campaign
          </a>
          <div className="player">
            {video && !playbackError ? (
              <video
                key={video.videoUrl}
                src={video.videoUrl}
                poster={video.posterUrl ?? undefined}
                controls
                autoPlay
                playsInline
                preload="metadata"
                onError={() => setPlaybackError(true)}
              />
            ) : (
              <div className="player__fallback">
                {video && <Thumbnail video={video} large angled={false} showPlay={false} />}
                {playbackError && <p className="player__message">This video file hasn't been uploaded yet.</p>}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container watch">
        <article className="box box--watch">
          {video ? (
            <>
              {editor ? (
                <div className="edit-fields">
                  <label>
                    Category
                    <select
                      value={video.category ?? ""}
                      onChange={(e) => saveVideo(video.slug, { category: e.target.value || null })}
                    >
                      <option value="">None</option>
                      {library?.categories.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="edit-fields__check">
                    <input
                      type="checkbox"
                      checked={video.featured}
                      onChange={(e) => saveVideo(video.slug, { featured: e.target.checked })}
                    />
                    Feature on home page
                  </label>
                </div>
              ) : (
                video.categoryName && <span className="eyebrow">{video.categoryName}</span>
              )}
              <Editable as="h1" className="box__title box__title--light" value={video.title} label="Title"
                onSave={(title) => saveVideo(video.slug, { title })} />
              <p className="box__meta">
                {[formatDuration(video.durationSeconds), new Date(video.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <Editable as="p" className="watch__summary" value={video.summary} label="Summary" multiline
                onSave={(summary) => saveVideo(video.slug, { summary })} />
              <Editable as="p" className="box__text" value={video.description} label="Description" multiline
                onSave={(description) => saveVideo(video.slug, { description })} />
            </>
          ) : (
            <>
              <div className="skeleton skeleton--title" />
              <div className="skeleton skeleton--line" />
            </>
          )}
        </article>

        <aside className="watch__aside" aria-label="Up next">
          <h2 className="aside-title">Up next</h2>
          <ul className="up-next">
            {related.map((v) => (
              <li key={v.id}>
                <a className="up-next__item" {...linkProps(`/watch/${v.slug}`)}>
                  <Thumbnail video={v} angled={false} />
                  <div>
                    <span className="eyebrow">{v.categoryName}</span>
                    <h3>{v.title}</h3>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </>
  );
}
