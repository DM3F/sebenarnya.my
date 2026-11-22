'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PauseFilled, PlayFilled } from '@/components/ui/filledIcons';
import { Badge, IconButton } from '@/components/ui';
import LogoKit from '@/components/LogoKit';
import SphereGallery from '@/components/SphereGallery';
import CountUp from '@/components/CountUp';
import { withBase } from '@/lib/basePath';
import { aboutHero as hero, aboutIntro as intro, aboutNews, articleStatus, articles, socialLinks } from '@/data/content';

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

const AUTOPLAY_MS = 5000; // Empat fungsi: time on each function

// Tentang Kami: Hero, About, Empat fungsi,
// Berita dan Galeri, Logo
export default function AboutUs() {
  return (
    <>
      <Hero />
      <Intro />
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

        <div className="about-hero-text">
          <h1 id="about-hero-title">{hero.title}</h1>
          <p>{hero.lead}</p>
        </div>
      </div>
    </section>
  );
}

// About: label + lead, three cards (story, partners, verdict mix), facts in numbers
const VERDICT_BARS = ['palsu', 'benar', 'makluman'];

// Atom: three orbits and a nucleus (line icon, currentColor)
function AtomMark() {
  return (
    <svg className="about-intro__mark" viewBox="0 0 96 96" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <ellipse cx="48" cy="48" rx="32" ry="12" />
      <ellipse cx="48" cy="48" rx="32" ry="12" transform="rotate(60 48 48)" />
      <ellipse cx="48" cy="48" rx="32" ry="12" transform="rotate(120 48 48)" />
      <circle cx="48" cy="48" r="6" fill="currentColor" />
    </svg>
  );
}

function Intro() {
  const counts = VERDICT_BARS.map((id) => ({ id, n: articles.filter((a) => a.status === id).length }));
  const max = Math.max(1, ...counts.map((c) => c.n));

  return (
    <section className="about-intro" aria-labelledby="about-intro-title">
      <div className="about-intro__head">
        <h2 className="about-intro__label" id="about-intro-title">{intro.label}</h2>
        <p className="about-intro__lead">{intro.lead}</p>
      </div>

      <div className="about-intro__cards">
        <div className="about-intro__card about-intro__card--story">
          <AtomMark />
          <div className="about-intro__story">
            <p className="about-intro__story-text">
              {intro.card.strong} <span>{intro.card.muted}</span> {intro.card.end}
            </p>
          </div>
        </div>

        <div className="about-intro__card about-intro__card--pill" style={{ backgroundImage: `url(${withBase(intro.pillImage)})` }}>
          <span className="about-intro__pill">{intro.pill}</span>
        </div>

        <div className="about-intro__card about-intro__card--stats">
          <div className="about-intro__stat">
            <p className="about-intro__stat-value"><StatValue text={intro.verdicts.value} /></p>
            <p className="about-intro__stat-title">{intro.verdicts.title}</p>
            <p className="about-intro__stat-text">{intro.verdicts.text}</p>
          </div>
          <ul className="about-intro__bars" aria-label="Artikel mengikut keputusan">
            {counts.map((c) => (
              <li key={c.id}>
                <span className="about-intro__bar-label">{articleStatus[c.id]?.label ?? c.id}</span>
                <span className="about-intro__bar" style={{ '--w': `${Math.round((c.n / max) * 100)}%` }} aria-hidden="true" />
                <span className="about-intro__bar-n">{c.n}</span>
              </li>
            ))}
          </ul>
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

// Shared by Empat fungsi and Berita: one item is featured, the rest follow as small cards.
// Autoplay holds while hovered or focused, while the tab is hidden, never runs with reduced
// motion, and has a visible pause control (WCAG 2.2.2). A manual pick restarts the timer.
function useCarousel(count) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false); // hover / focus hold
  const [stopped, setStopped] = useState(false); // visible pause control
  const [dir, setDir] = useState(1); // 1 = forward (content enters from the right), -1 = back
  const move = (n) => {
    setDir(n < 0 ? -1 : 1);
    setActive((a) => (a + n + count) % count);
  };
  const pick = (i) => {
    setDir(1); // picking a card from the queue always reads as "forward"
    setActive(i);
  };

  useEffect(() => {
    if (paused || stopped || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => {
      if (!document.hidden) {
        setDir(1);
        setActive((a) => (a + 1) % count);
      }
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, stopped, count]);

  const rest = Array.from({ length: count - 1 }, (_, k) => (active + k + 1) % count);
  const holdProps = {
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: (e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false),
  };
  return { active, setActive: pick, move, dir, paused, stopped, setStopped, rest, holdProps };
}

// Berita dan Galeri: the selected news item is shown large, the others follow as small cards
// (same carousel as Empat fungsi); the photo sphere sits below.
function NewsGallery() {
  const { news, gallery } = aboutNews;
  const { active, setActive, move, dir, paused, stopped, setStopped, rest, holdProps } = useCarousel(news.length);
  const feature = news[active];

  return (
    <section
      className={`about-news${paused ? ' is-paused' : ''}`}
      id="berita-galeri"
      aria-labelledby="about-news-title"
      data-dir={dir < 0 ? 'back' : 'forward'}
      {...holdProps}
    >
      <div className="about-news__head">
        <h2 className="about-title" id="about-news-title">
          {aboutNews.title}
        </h2>
        <p className="about-news-intro">{aboutNews.intro}</p>
      </div>

      <div className="news-body">
        <div className="news-main">
          <article className="news-feature" aria-live={paused || stopped ? 'polite' : 'off'}>
            <div className="news-media" key={`m${active}`}>
              <img src={feature.image} alt={feature.alt} style={feature.focus ? { objectPosition: feature.focus } : undefined} />
            </div>
            <div className="news-feature__body" key={`b${active}`}>
              <Badge className="news-tag">{feature.tag}</Badge>
              <h3>{feature.title}</h3>
            </div>
          </article>

          <div className="about-fn-controls">
            <div className="about-fn-arrows">
              <IconButton icon={ChevronLeft} label="Berita sebelumnya" onClick={() => move(-1)} />
              <IconButton icon={ChevronRight} label="Berita seterusnya" onClick={() => move(1)} />
              <IconButton
                icon={stopped ? PlayFilled : PauseFilled}
                label={stopped ? 'Mainkan berita' : 'Jeda berita'}
                onClick={() => setStopped((v) => !v)}
              />
            </div>
            <div className="about-fn-track" style={{ '--n': news.length }} aria-hidden="true">
              <span style={{ transform: `translateX(${active * 100}%)` }} />
            </div>
          </div>
        </div>

        <div className="news-side">
          <div className="news-cards">
            {rest.map((i, k) => (
              <button
                type="button"
                className="news-card"
                key={`${active}-${i}`} // remount so the content eases in after each change
                style={{ '--i': k }}
                onClick={() => setActive(i)}
                aria-label={`Pilih berita: ${news[i].title}`}
              >
                <span className="news-media" style={{ aspectRatio: news[i].ratio }}>
                  <img src={news[i].image} alt="" loading="lazy" />
                </span>
                <span className="news-card__body">
                  <Badge className="news-tag">{news[i].tag}</Badge>
                  <span className="news-card__title">{news[i].title}</span>
                </span>
              </button>
            ))}
          </div>
          <p className="news-lead">{aboutNews.lead}</p>
        </div>
      </div>

      <h3 className="sr-only">{aboutNews.galleryTitle}</h3>
      <SphereGallery items={gallery} />
    </section>
  );
}
