import { useState } from "react";

// "Catch yourself" typing animation. The <seqirus-disappear> element is defined by
// /seqirus-disappear.js (loaded from index.html); config is the explorer's "Copy embed code" JSON.
const CONFIG = {
  reply: true, rcol: "#FC1921", rexit: "float", vpos: "middle", typeIn: true, brandOn: false, transp: true,
  mode: "tw", brand: "csl", ground: "near", ink: "auto", tink: "same", big: 1, cw: 0.04, grain: 2,
  wind: 1, lime: true, sty: 0, dens: 2.1, depth: 0, clump: 0, trail: false, shl: 0.28, sfade: 0.85, kpos: "after",
  kfade: 0.75, edot: "ink", epulse: false, eafter: "stop", frame: "off", over: true, caps: true, shade: 0.25,
  gpos: "third", gblur: 28, gtint: 0.35, gwid: 0.46,
};

/**
 * Canvas shape for this screen. The element is sized in CSS (styles.css, .banner__image--animation) to run
 * from just left of the page grid to the right edge of the screen; this picks a custom format with that
 * width and a height of up to 600px, so the text stays the same size and the mist has room to drift.
 * Read once on load: the element doesn't re-read its config on resize.
 */
function heroFormat() {
  const vw = document.documentElement.clientWidth;
  const gutter = Math.min(40, Math.max(16, vw * 0.04)); // --gutter
  const gridLeft = Math.max(gutter, (vw - 1180) / 2 + gutter); // --max: 1180px
  const width = (vw - gridLeft) / 0.955;
  const height = Math.min(600, (width * 9) / 16);
  return { fmt: "custom", cuW: Math.round((1080 * width) / height), cuH: 1080 };
}

// Played in order: each half-finished line types on, then its reply (in rcol) answers it
// and breaks up into a drifting particle cloud (rexit: "float") before the next line.
// The element reads these once, when it is first attached.
const LINES = [
  { line: "I’ll book my flu jab lat", reply: "I’ll book my flu jab now" },
  { line: "It’s only fl", reply: "Flu can floor you" },
  { line: "I’ll be fi", reply: "It could be serious" },
  { line: "It’s on my li", reply: "It’s off my list" },
  { line: "I never get fl", reply: "Anyone can get flu" },
];

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "seqirus-disappear": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        config?: string;
        image?: string;
        loop?: "true" | "false";
        autoplay?: "true" | "false";
      };
    }
  }
}

export function HeroAnimation() {
  const [config] = useState(() => JSON.stringify({ ...CONFIG, ...heroFormat() }));
  return (
    <seqirus-disappear config={config}>
      {LINES.map(({ line, reply }) => (
        <p key={line} data-reply={reply}>
          {line}
        </p>
      ))}
    </seqirus-disappear>
  );
}
