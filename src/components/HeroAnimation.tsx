// "Catch yourself" typing animation. The <seqirus-disappear> element is defined by
// /seqirus-disappear.js (loaded from index.html); config is the explorer's "Copy embed code" JSON.
const CONFIG = JSON.stringify({
  vpos: "middle", cuW: 1920, cuH: 1080, typeIn: true, brandOn: false, transp: true, mode: "tw", fmt: "16:9",
  brand: "csl", ground: "near", ink: "auto", tink: "same", big: 1, cw: 0.04, grain: 2, wind: 1, lime: true,
  sty: 0, dens: 2.1, depth: 0, clump: 0, trail: false, shl: 0.28, sfade: 0.85, kpos: "after", kfade: 0.75,
  edot: "ink", epulse: false, eafter: "stop", frame: "off", over: true, caps: true, shade: 0.25, gpos: "third",
  gblur: 28, gtint: 0.35, gwid: 0.46,
});

// Played in order, typing on and deleting off. The element reads these once, when it is first attached.
const LINES = ["I’ll book my flu jab lat", "It’s only fl", "I’ll be fi", "It’s on my li", "I never get fl"];

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
  return (
    <seqirus-disappear config={CONFIG}>
      {LINES.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </seqirus-disappear>
  );
}
