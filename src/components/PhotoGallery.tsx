import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "./Icons";

export interface Photo {
  /** Grid image; null shows a placeholder tile. */
  src: string | null;
  /** Larger version for the lightbox (defaults to src). */
  full?: string;
  alt: string;
}

/**
 * Photo grid that opens a full-screen lightbox. Uses a native modal <dialog>, so focus is trapped,
 * Escape closes and focus returns to the clicked photo. Arrow keys and swipes move between photos.
 */
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const swipeStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  const step = (by: number) => setIndex((i) => (i === null ? i : (i + by + photos.length) % photos.length));

  // Preload neighbours so moving through the set feels instant.
  useEffect(() => {
    if (index === null) return;
    for (const by of [-1, 1]) {
      const p = photos[(index + by + photos.length) % photos.length];
      if (p.src) new Image().src = p.full ?? p.src;
    }
  }, [index, photos]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className="photos">
        {photos.map((p, i) => (
          <li key={p.src ?? i}>
            <button type="button" className="photo" onClick={() => open(i)} aria-label={`View larger: ${p.alt}`}>
              {p.src ? (
                <img src={p.src} alt="" loading="lazy" />
              ) : (
                <span className="photo--placeholder">{p.alt}</span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Photo viewer"
        onClose={() => setIndex(null)}
        // Clicks on the dark backdrop land on the dialog itself; clicks on the photo or buttons don't.
        // A swipe that ends over the backdrop also fires a click, so ignore that one.
        onClick={(e) => {
          if (e.target === e.currentTarget && !swiped.current) dialog.current?.close();
          swiped.current = false;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
        onPointerDown={(e) => (swipeStart.current = e.clientX)}
        onPointerUp={(e) => {
          const dx = swipeStart.current === null ? 0 : e.clientX - swipeStart.current;
          swipeStart.current = null;
          swiped.current = Math.abs(dx) > 50;
          if (swiped.current) step(dx < 0 ? 1 : -1);
        }}
      >
        {current && (
          <figure className="lightbox__figure">
            {current.src ? (
              <img src={current.full ?? current.src} alt={current.alt} draggable={false} />
            ) : (
              <div className="lightbox__placeholder photo--placeholder">{current.alt}</div>
            )}
            <figcaption className="lightbox__caption">
              <span>{current.alt}</span>
              <span className="lightbox__count" aria-live="polite">
                {index! + 1} / {photos.length}
              </span>
            </figcaption>
          </figure>
        )}
        <button type="button" className="lightbox__btn lightbox__close" onClick={() => dialog.current?.close()} aria-label="Close" autoFocus>
          <CloseIcon />
        </button>
        {photos.length > 1 && (
          <>
            <button type="button" className="lightbox__btn lightbox__prev" onClick={() => step(-1)} aria-label="Previous photo">
              <ArrowLeftIcon size={22} />
            </button>
            <button type="button" className="lightbox__btn lightbox__next" onClick={() => step(1)} aria-label="Next photo">
              <ArrowRightIcon size={22} />
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
