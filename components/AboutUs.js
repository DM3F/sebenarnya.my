'use client';

import { Badge } from '@/components/ui';
import LogoKit from '@/components/LogoKit';
import GalleryGrid from '@/components/GalleryGrid';
import CountUp from '@/components/CountUp';
import { withBase } from '@/lib/basePath';
import { aboutHero as hero, aboutIntro as intro, aboutNews, aboutProcess as process, socialLinks } from '@/data/content';

// "275 juta+" → <CountUp 275/> juta+ ; "1,016" keeps its thousands separator
function StatValue({ text }) {
  const m = /^([\d,]+)(.*)$/.exec(text);
  if (!m) return text;
  return (
    <>
      <CountUp value={Number(m[1].replace(/,/g, ''))} sep={m[1].includes(',')} />
      {m[2]}
    </>
  );
}


// Tentang Kami: Hero, About, Empat fungsi,
// Berita dan Galeri, Logo
export default function AboutUs() {
  return (
    <>
      <Hero />
      <Intro />
      <Process />
      <NewsGallery />
      <LogoKit headingLevel={2} />
    </>
  );
}

// Hero: photo card, social links on top, title + lead at the bottom
function Hero() {
  const links = hero.social.map((id) => socialLinks.find((l) => l.id === id)).filter(Boolean);

  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero-card">
        <img className="about-hero-bg" src={hero.image} alt="" />

        <div className="about-hero-follow">
          <p>{hero.follow}</p>
          <ul>
            {links.map((l) => (
              <li key={l.id}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`${l.label} (tab baharu)`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d={l.icon} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="about-hero-aifa">
          <article className="aifa-card aifa-card--media">
            {/* Muted, looping reel (autoplay needs muted + playsInline); the poster shows until it plays
                or if the video can't load. The whole frame opens the reel on Instagram. */}
            <a
              className="aifa-card__media"
              href={hero.aifa.reel}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tonton video AIFA di Instagram (tab baharu)"
              style={{ backgroundImage: `url(${hero.aifa.poster})` }} /* reduced motion hides the video and shows this */
            >
              <video src={hero.aifa.video} poster={hero.aifa.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
            </a>
            <p>{hero.aifa.caption}</p>
          </article>
          <article className="aifa-card aifa-card--info">
            <p className="aifa-card__title">{hero.aifa.title}</p>
            <p>{hero.aifa.text}</p>
          </article>
        </div>

        <div className="about-hero-text">
          <h1 id="about-hero-title">{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>
      </div>
    </section>
  );
}

// About: label + lead, three cards (Visi, partners photo, Misi), facts in numbers
function Intro() {
  return (
    <section className="about-intro" aria-labelledby="about-intro-title">
      <div className="about-intro__head">
        <h2 className="about-intro__label" id="about-intro-title">{intro.label}</h2>
        <p className="about-intro__lead">
          <strong>{intro.lead.strong}</strong> {intro.lead.text} <span>{intro.lead.muted}</span>
        </p>
      </div>

      <div className="about-intro__cards">
        <div className="about-intro__card about-intro__card--vision">
          <h3 className="about-intro__card-tag">{intro.vision.tag}</h3>
          <p className="about-intro__card-text">{intro.vision.text}</p>
        </div>

        <div className="about-intro__card about-intro__card--pill" style={{ backgroundImage: `url(${withBase(intro.pillImage)})` }}>
          <span className="about-intro__pill">{intro.pill}</span>
        </div>

        <div className="about-intro__card about-intro__card--mission">
          <h3 className="about-intro__card-tag">{intro.mission.tag}</h3>
          <p className="about-intro__card-text">{intro.mission.text}</p>
        </div>
      </div>

      <div className="about-intro__facts">
        <h3 className="about-intro__facts-title">{intro.factsTitle}</h3>
        <dl className="about-intro__facts-row">
          {intro.facts.map((f) => (
            <div key={f.label}>
              <dt><StatValue text={f.value} /></dt>
              <dd>{f.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

// Bagaimana kami menyemak fakta: a framed head (badge, title, lead), then a vertical timeline.
// Wide screens: the rail runs down the middle and stages alternate sides (text | photo, then
// photo | text). Narrow: one column with the rail on the leading edge. An ordered list, so the
// order is announced; the rail is decoration.
function Process() {
  return (
    <section className="about-process" aria-labelledby="about-process-title">
      <div className="about-process__frame">
        <div className="about-process__head">
          <Badge variant="outline">{process.badge}</Badge>
          <h2 className="about-title" id="about-process-title">{process.title}</h2>
          <p className="about-process__lead">{process.lead}</p>
        </div>

        <ol className="process">
          {process.steps.map((step, i) => (
            <li className="process__step" key={step.title}>
              <div className="process__info">
                <p className="process__num" aria-hidden="true">({String(i + 1).padStart(2, '0')})</p>
                <h3 className="process__title">{step.title}</h3>
                <p className="process__text">{step.text}</p>
              </div>
              <span className="process__rail" aria-hidden="true" />
              <img className="process__img" src={step.image} alt={step.alt} loading="lazy" />
            </li>
          ))}
        </ol>

        <div className="about-process__end" aria-hidden="true" />
      </div>
    </section>
  );
}

// Berita dan Galeri: two rows of news photos drifting in opposite directions (top row left, bottom
// row right), then the photo grid. Each row renders its cards twice so the loop is seamless; the
// copy is hidden from assistive tech. Hover pauses it. With reduced motion the rows stop and
// scroll by hand instead.
function NewsMarquee({ rows }) {
  return (
    <div className="marquee">
      <div className="marquee__rows">
        {rows.map((row, r) => (
          <div className="marquee__row" data-dir={r % 2 === 0 ? 'left' : 'right'} key={r}>
            <div className="marquee__track">
              {[0, 1].map((copy) => (
                <ul className="marquee__set" key={copy} aria-hidden={copy === 1 ? 'true' : undefined} aria-label={copy === 0 ? `Berita, baris ${r + 1}` : undefined}>
                  {row.map((n) => (
                    <li className={`marquee-card marquee-card--${n.title ? 'wide' : 'narrow'}`} key={n.image}>
                      <img src={n.image} alt={copy === 0 ? n.alt : ''} loading="lazy" draggable="false" />
                      <div className="marquee-card__body">
                        <Badge className="marquee-card__tag">{n.tag}</Badge>
                        {n.title && <p className="marquee-card__title">{n.title}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Berita dan Galeri: the marquee of news, then the photo grid
function NewsGallery() {
  const { marquee, gallery } = aboutNews;

  return (
    <section className="about-news" id="berita-galeri" aria-labelledby="about-news-title">
      <div className="about-news__head">
        <h2 className="about-title" id="about-news-title">
          {aboutNews.title}
        </h2>
        <p className="about-news-intro">{aboutNews.intro}</p>
      </div>

      <NewsMarquee rows={marquee} />

      <h3 className="sr-only">{aboutNews.galleryTitle}</h3>
      <GalleryGrid sections={gallery} />
    </section>
  );
}
