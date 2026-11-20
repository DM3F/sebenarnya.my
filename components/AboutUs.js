'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import LogoKit from '@/components/LogoKit';
import { aboutHero as hero, aboutNews, howItWorks, socialLinks, whatWeDo } from '@/data/content';

const pad = (n) => String(n).padStart(2, '0');

// Tentang Kami (Paper › Artwork › Tentang Kami): Hero, Empat fungsi, How it works,
// Berita dan Galeri, Logo
export default function AboutUs() {
  return (
    <>
      <Hero />
      <Functions />
      <HowItWorks />
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

// Empat fungsi: the selected function is shown large; the other three follow as small cards.
// Prev/next wrap around; a small card can be picked directly.
function Functions() {
  const { items } = whatWeDo;
  const count = items.length;
  const [active, setActive] = useState(0);
  const move = (n) => setActive((a) => (a + n + count) % count);
  const rest = Array.from({ length: count - 1 }, (_, k) => (active + k + 1) % count);
  const feature = items[active];

  return (
    <section className="about-fn" aria-labelledby="about-fn-title">
      <h2 className="about-fn-title" id="about-fn-title">
        {whatWeDo.title}
      </h2>

      <div className="about-fn-body">
        <div className="about-fn-main">
          <article className="about-fn-feature" aria-live="polite">
            {/* key restarts the enter animation when the selection changes */}
            <div className="about-fn-feature-top" key={`t${active}`}>
              <h3>{feature.title}</h3>
              <span className="about-fn-num">/{pad(active + 1)}</span>
            </div>
            <p key={`p${active}`}>{feature.text}</p>
          </article>

          <div className="about-fn-controls">
            <div className="about-fn-arrows">
              <button type="button" aria-label="Fungsi sebelumnya" onClick={() => move(-1)}>
                <Icon icon={ChevronLeft} size={20} />
              </button>
              <button type="button" aria-label="Fungsi seterusnya" onClick={() => move(1)}>
                <Icon icon={ChevronRight} size={20} />
              </button>
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

// How It Works: fact-checking steps on a timeline
function HowItWorks() {
  const { steps } = howItWorks;

  return (
    <section className="hiw container" aria-labelledby="hiw-title">
      <h2 className="about-title" id="hiw-title">
        {howItWorks.title}
      </h2>
      <p className="hiw-intro">{howItWorks.intro}</p>

      <ol className="hiw-steps">
        {steps.map((step) => (
          <li className="hiw-step" key={step.title}>
            <span className="hiw-dot" aria-hidden="true" />
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Berita dan Galeri: three news cards, then a photo grid
function NewsGallery() {
  const { news, gallery } = aboutNews;

  return (
    <section className="about-news" aria-labelledby="about-news-title">
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
              <span className="about-news-tag">{n.tag}</span>
              <h4>{n.title}</h4>
              <p>{n.text}</p>
            </div>
          </article>
        ))}
      </div>

      <h3 className="about-subtitle">{aboutNews.galleryTitle}</h3>
      <ul className="about-gallery">
        {gallery.map((g) => (
          <li className={`about-gallery-tile${g.wide ? ' wide' : ''}`} key={g.caption}>
            <figure>
              <img src={g.image} alt="" loading="lazy" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
