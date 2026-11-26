import { EditableText, useEdit, useText } from "../edit";
import { ArrowRightIcon } from "./Icons";

// Destinations. The first three sites are fictitious, so href is null until real pages exist.
// Images are Unsplash License photos, duotoned in brand colours (public/images/cards).
const CARDS: { n: number; href: string | null; image: string; credit: string }[] = [
  { n: 1, href: null, image: "eligibility", credit: "Ed Us, unsplash.com/photos/K0DMl4NmOPo" },
  { n: 2, href: null, image: "advice", credit: "National Cancer Institute, unsplash.com/photos/NNpo-liY5aU" },
  { n: 3, href: null, image: "faq", credit: "Kelly Sikkema, unsplash.com/photos/RmByg5kFfQg" },
  { n: 4, href: "https://www.nhs.uk/vaccinations/flu-vaccine/", image: "nhs", credit: "Kristine Wook, unsplash.com/photos/E1_RW3HIbUw" },
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

function LinkCard({ n, href, image }: (typeof CARDS)[number]) {
  const { editor } = useEdit();
  const button = useText(`more.${n}.button`);
  const external = href?.startsWith("http");

  return (
    // The button's ::after stretches over the card so the whole card is clickable,
    // except in edit mode where clicks need to reach the text.
    <li className={`link-card${editor ? "" : " link-card--clickable"}`}>
      <img className="link-card__image" src={`/images/cards/${image}.webp`} alt="" width={800} height={500} loading="lazy" />
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
