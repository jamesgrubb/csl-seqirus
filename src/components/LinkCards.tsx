import { EditableText, useEdit, useText } from "../edit";
import { ArrowRightIcon } from "./Icons";

type Preview = "form" | "people" | "faq" | "article";

// Destinations. The first three sites are fictitious, so href is null until real pages exist.
// Each card shows a drawn preview of its page in place of a screenshot.
const CARDS: { n: number; href: string | null; url: string; preview: Preview }[] = [
  { n: 1, href: null, url: "catchyourselfnotflu.co.uk/eligibility", preview: "form" },
  { n: 2, href: null, url: "catchyourselfnotflu.co.uk/advice", preview: "people" },
  { n: 3, href: null, url: "catchyourselfnotflu.co.uk/faq", preview: "faq" },
  { n: 4, href: "https://www.nhs.uk/vaccinations/flu-vaccine/", url: "nhs.uk/vaccinations/flu-vaccine", preview: "article" },
];

export function LinkCards() {
  return (
    <section className="section container more">
      <EditableText as="h2" className="section-title" contentKey="more.title" label="Link cards heading" />
      <ul className="more__grid">
        {CARDS.map((c) => (
          <LinkCard key={c.n} {...c} />
        ))}
      </ul>
    </section>
  );
}

function LinkCard({ n, href, url, preview }: (typeof CARDS)[number]) {
  const { editor } = useEdit();
  const button = useText(`more.${n}.button`);
  const external = href?.startsWith("http");

  return (
    // The button's ::after stretches over the card so the whole card is clickable,
    // except in edit mode where clicks need to reach the text.
    <li className={`link-card${editor ? "" : " link-card--clickable"}`}>
      <SitePreview url={url} kind={preview} />
      <div className="link-card__body">
        <EditableText as="h3" className="link-card__title" contentKey={`more.${n}.title`} label="Card title" />
        <EditableText as="p" className="link-card__text" contentKey={`more.${n}.text`} label="Card text" multiline />
        {editor ? (
          <EditableText as="span" className="btn btn--small link-card__btn" contentKey={`more.${n}.button`} label="Button" />
        ) : (
          // The first three sites are fictitious for now, so their buttons go nowhere.
          <a
            className="btn btn--small link-card__btn"
            href={href ?? "#"}
            {...(external && { target: "_blank", rel: "noreferrer" })}
            onClick={href ? undefined : (e) => e.preventDefault()}
          >
            {button} <ArrowRightIcon size={14} />
            {external && <span className="visually-hidden"> (opens in a new tab)</span>}
          </a>
        )}
      </div>
    </li>
  );
}

/** A small drawn browser window standing in for a screenshot of the destination page. */
function SitePreview({ url, kind }: { url: string; kind: Preview }) {
  return (
    <div className={`site-preview site-preview--${kind}`} aria-hidden="true">
      <div className="site-preview__bar">
        <span className="site-preview__dots" />
        <span className="site-preview__url">{url}</span>
      </div>
      <div className="site-preview__page">
        <span className="sp-heading" />
        {kind === "form" && (
          <>
            {[0, 1, 2].map((i) => (
              <span key={i} className="sp-option">
                <span className="sp-radio" />
                <span className="sp-line" />
              </span>
            ))}
            <span className="sp-button" />
          </>
        )}
        {kind === "people" &&
          [0, 1].map((i) => (
            <span key={i} className="sp-quote">
              <span className="sp-avatar" />
              <span className="sp-lines">
                <span className="sp-line" />
                <span className="sp-line sp-line--short" />
              </span>
            </span>
          ))}
        {kind === "faq" &&
          [0, 1, 2, 3].map((i) => (
            <span key={i} className="sp-faq">
              <span className="sp-line" />
              <span className="sp-plus">+</span>
            </span>
          ))}
        {kind === "article" && (
          <>
            <span className="sp-line" />
            <span className="sp-line" />
            <span className="sp-line sp-line--short" />
            <span className="sp-callout" />
            <span className="sp-line" />
          </>
        )}
      </div>
    </div>
  );
}
