'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Badge, IconButton } from '@/components/ui';
import LogoKit from '@/components/LogoKit';
import SphereGallery from '@/components/SphereGallery';
import { aboutHero as hero, aboutIntro as intro, aboutNews, socialLinks, whatWeDo } from '@/data/content';

const pad = (n) => String(n).padStart(2, '0');
const AUTOPLAY_MS = 5000; // Empat fungsi: time on each function

// Tentang Kami: Hero, About, Empat fungsi,
// Berita dan Galeri, Logo
export default function AboutUs() {
  return (
    <>
      <Hero />
      <Intro />
      <Functions />
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

// Statement: two lines of plain text, styled like the "Semakan fakta terkini" heading
function Intro() {
  return (
    <section className="about-intro" aria-label="Tentang kami">
      <h2 className="about-intro__statement">
        {intro.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h2>
    </section>
  );
}

// Empat fungsi: the selected function is shown large; the other three follow as small cards.
// Prev/next wrap around; a small card can be picked directly.
function Functions() {
  const { items } = whatWeDo;
  const count = items.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false); // hover / focus hold
  const [stopped, setStopped] = useState(false); // visible pause control (WCAG 2.2.2)
  const move = (n) => setActive((a) => (a + n + count) % count);

  // Autoplay: next function every 5s. Holds while hovered or focused, while the tab is
  // hidden, and never runs with reduced motion. A manual pick restarts the timer.
  useEffect(() => {
    if (paused || stopped || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => {
      if (!document.hidden) setActive((a) => (a + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [active, paused, stopped, count]);
  const rest = Array.from({ length: count - 1 }, (_, k) => (active + k + 1) % count);
  const feature = items[active];

  return (
    <section
      className={`about-fn${paused ? ' is-paused' : ''}`}
      aria-labelledby="about-fn-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
    >
      <h2 className="about-fn-title" id="about-fn-title">
        {whatWeDo.title}
      </h2>

      <div className="about-fn-body">
        <div className="about-fn-main">
          <article className="about-fn-feature" aria-live={paused || stopped ? 'polite' : 'off'}>
            {/* key restarts the enter animation when the selection changes */}
            <div className="about-fn-feature-top" key={`t${active}`}>
              <h3>{feature.title}</h3>
              <span className="about-fn-num">/{pad(active + 1)}</span>
            </div>
            <p key={`p${active}`}>{feature.text}</p>
          </article>

          <div className="about-fn-controls">
            <div className="about-fn-arrows">
              <IconButton icon={ChevronLeft} label="Fungsi sebelumnya" onClick={() => move(-1)} />
              <IconButton icon={ChevronRight} label="Fungsi seterusnya" onClick={() => move(1)} />
              <IconButton
                icon={stopped ? Play : Pause}
                label={stopped ? 'Mainkan fungsi' : 'Jeda fungsi'}
                onClick={() => setStopped((v) => !v)}
              />
            </div>
            <div className="about-fn-track" aria-hidden="true">
              <span style={{ transform: `translateX(${active * 100}%)` }} />
            </div>
          </div>
        </div>

        <div className="about-fn-side">
          <div className="about-fn-cards">
            {rest.map((i, k) => (
              <button
                type="button"
                className="about-fn-card"
                key={`${active}-${i}`} // remount so the content eases in after each change
                style={{ '--i': k }}
                onClick={() => setActive(i)}
                aria-label={`Pilih fungsi ${pad(i + 1)}: ${items[i].title}`}
              >
                <span className="about-fn-card-top">
                  <span className="about-fn-card-title">{items[i].title}</span>
                  <span className="about-fn-num">/{pad(i + 1)}</span>
                </span>
                <span className="about-fn-card-text">{items[i].text}</span>
              </button>
            ))}
          </div>
          <p className="about-fn-intro">{whatWeDo.intro}</p>
        </div>
      </div>
    </section>
  );
}


// Berita dan Galeri: three news cards, then a photo grid
function NewsGallery() {
  const { news, gallery } = aboutNews;

  return (
    <section className="about-news" id="berita-galeri" aria-labelledby="about-news-title">
      <h2 className="about-title" id="about-news-title">
        {aboutNews.title}
      </h2>
      <p className="about-news-intro">{aboutNews.intro}</p>

      <h3 className="about-subtitle">{aboutNews.newsTitle}</h3>
      <div className="about-news-grid">
        {news.map((n) => (
          <article className="about-news-card" key={n.title}>
            <div className="about-news-media" style={{ aspectRatio: n.ratio }}>
              <img src={n.image} alt={n.alt} loading="lazy" />
            </div>
            <div className="about-news-body">
              <Badge className="about-news-tag">{n.tag}</Badge>
              <h4>{n.title}</h4>
              <p>{n.text}</p>
            </div>
          </article>
        ))}
      </div>

      <h3 className="about-subtitle">{aboutNews.galleryTitle}</h3>
      <SphereGallery items={gallery} />
    </section>
  );
}

