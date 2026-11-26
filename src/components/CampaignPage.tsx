import type { Video, VideoListResponse } from "../../shared/types";
import { Editable, EditableText, useEdit } from "../edit";
import { linkProps } from "../router";
import { FluJabMap } from "./FluJabMap";
import { HeroAnimation } from "./HeroAnimation";
import { LinkCards } from "./LinkCards";
import { PhotoGallery, type Photo } from "./PhotoGallery";
import { Thumbnail } from "./Thumbnail";

// Assets still to come. Drop the files into public/ and set the paths here.
const REPORT_PDF: string | null = null; // e.g. "/report/catch-yourself-report.pdf"
const REPORT_COVER: string | null = "/images/report/report-cover.webp"; // mock-up on transparent ground (original in media-src/)
// Grid uses the 800px file; the lightbox loads the full-size one. Files are in public/images/southbank.
const southbank = (n: number, alt: string): Photo => ({
  src: `/images/southbank/southbank-0${n}-800.webp`,
  full: `/images/southbank/southbank-0${n}.webp`,
  alt,
});
const SOUTHBANK_PHOTOS: Photo[] = [
  southbank(1, "A couple take a selfie in a mirror panel reading “I’ll book my flu jab lat”, with St Paul’s across the river"),
  southbank(2, "A woman stops at a mirror panel reading “It’s only fl” on the riverside walk near Waterloo"),
  southbank(3, "Friends take a selfie in a mirror panel reading “I’ll be fi”, with the Houses of Parliament behind"),
  southbank(4, "A man looks at a mirror panel reading “It’s on my li” in front of the London Eye"),
  southbank(5, "A parent and child wave at their reflection in a mirror panel reading “I never get fl”"),
];
const PHOTO_PLACEHOLDERS = 5;

export function CampaignPage({ data }: { data: VideoListResponse | null }) {
  return (
    <>
      <Hero />
      <TalkingHeads videos={data?.videos ?? null} />
      <Stats />
      <Report />
      <SouthBank />
      <FindFluJab />
      <LinkCards />
      <Close />
    </>
  );
}

function Hero() {
  return (
    <section className="banner banner--animation">
      <div className="banner__image banner__image--animation">
        <HeroAnimation />
        <EditableText as="h1" className="hero__title" contentKey="hero.title" label="Campaign line" />
      </div>
      <div className="container banner__content">
        <div className="box box--hero box--intro">
          <EditableText as="p" className="intro__text" contentKey="intro.text" label="Intro" multiline />
        </div>
      </div>
    </section>
  );
}

function TalkingHeads({ videos }: { videos: Video[] | null }) {
  return (
    <section className="section container">
      <EditableText as="h2" className="section-title" contentKey="familiar.title" label="Talking heads heading" />
      <div className="heads">
        {videos
          ? videos.map((v) => <TalkingHead key={v.id} video={v} />)
          : [0, 1].map((i) => <div key={i} className="thumb skeleton" />)}
      </div>
    </section>
  );
}

function TalkingHead({ video }: { video: Video }) {
  const { saveVideo } = useEdit();
  return (
    <figure className="head">
      <a {...linkProps(`/watch/${video.slug}`)} aria-label={`Play ${video.title}`}>
        <Thumbnail video={video} />
      </a>
      <figcaption>
        <Editable as="p" className="head__quote" value={video.summary} label="Quote" multiline
          onSave={(summary) => saveVideo(video.slug, { summary })} />
      </figcaption>
    </figure>
  );
}

function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <EditableText as="h2" className="statement__title stats__title" contentKey="stats.title" label="Stats heading" />
        <div className="stats__grid">
          <Stat n={1} />
          <div className="stats__group">
            <EditableText as="p" className="stats__label" contentKey="stats.group" label="Group label" />
            <div className="stats__pair">
              <Stat n={2} />
              <Stat n={3} />
            </div>
          </div>
        </div>
        <a className="stats__source" href="#source">Source: YouGov for Spectrum Science, November 2026</a>
      </div>
    </section>
  );
}

function Stat({ n }: { n: number }) {
  return (
    <div className="stat">
      <EditableText as="p" className="stat__figure" contentKey={`stats.${n}.figure`} label="Figure" />
      <EditableText as="p" className="stat__text" contentKey={`stats.${n}.text`} label="Figure text" multiline />
    </div>
  );
}

function Report() {
  return (
    <section className="section container report">
      <div className={`report__cover${REPORT_COVER ? " report__cover--image" : ""}`}>
        {REPORT_COVER ? (
          <img
            src={REPORT_COVER}
            alt="The Catch yourself. Not the flu. campaign report 2026, with a silver foil cover"
            width={1200}
            height={1380}
            loading="lazy"
          />
        ) : (
          <div className="cover-placeholder" aria-hidden="true">
            <span className="cover-placeholder__brand">CSL Seqirus</span>
            <span className="cover-placeholder__title">Catch yourself. Not the flu.</span>
            <span className="cover-placeholder__sub">Campaign report 2026</span>
          </div>
        )}
      </div>
      <div className="box report__box">
        <EditableText as="h2" className="box__title box__title--light" contentKey="report.title" label="Report heading" />
        <div className="box__actions">
          {REPORT_PDF ? (
            <a className="btn" href={REPORT_PDF} download>Download the report (PDF)</a>
          ) : (
            <span className="btn btn--disabled" aria-disabled="true">Report coming soon</span>
          )}
        </div>
      </div>
    </section>
  );
}

function SouthBank() {
  const photos: Photo[] = SOUTHBANK_PHOTOS.length
    ? SOUTHBANK_PHOTOS
    : Array.from({ length: PHOTO_PLACEHOLDERS }, (_, i) => ({ src: null, alt: `South Bank photo ${i + 1}` }));
  return (
    <section className="southbank">
      <div className="container">
        <div className="box southbank__box">
          <EditableText as="h2" className="box__title box__title--light" contentKey="southbank.title" label="South Bank heading" />
        </div>
        <PhotoGallery photos={photos} />
      </div>
    </section>
  );
}

function FindFluJab() {
  return (
    <section className="section container find" id="find">
      <EditableText as="h2" className="statement__title find__title" contentKey="map.title" label="Map heading" />
      <FluJabMap />
    </section>
  );
}

function Close() {
  return (
    <section className="close">
      <div className="container close__inner">
        <EditableText as="p" className="close__text" contentKey="close.text" label="Closing line" multiline />
        <EditableText as="p" className="signoff signoff--large" contentKey="close.signoff" label="Closing sign-off" />
        <a className="btn" href="#find">Find a flu jab service</a>
      </div>
    </section>
  );
}
