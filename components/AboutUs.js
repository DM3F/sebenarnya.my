'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Badge, IconButton } from '@/components/ui';
import LogoKit from '@/components/LogoKit';
import CountUp from '@/components/CountUp';
import { withBase } from '@/lib/basePath';
import { aboutHero as hero, aboutIntro as intro, aboutNews, aboutProcess as process, aboutRoles as roles, socialLinks } from '@/data/content';

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
      <Roles />
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
        <h2 className="about-intro__label" id="about-intro-title">
          <Badge variant="eyebrow">{intro.label}</Badge>
        </h2>
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
// Scroll progress: the rail fills in ink from the top down to a pointer that sits level with the
// middle of the viewport, and each stage's dot turns ink once the pointer passes it.
function Process() {
  const wrapRef = useScrollProgress();

  return (
    <section className="about-process" aria-labelledby="about-process-title">
      <div className="about-process__frame">
        <div className="about-process__head">
          <Badge variant="eyebrow">{process.badge}</Badge>
          <h2 className="about-title" id="about-process-title">{process.title}</h2>
          <p className="about-process__lead">{process.lead}</p>
        </div>

        <div className="process-wrap" ref={wrapRef}>
          <span className="process__track" aria-hidden="true" />
          <span className="process__fill" aria-hidden="true" />
          <span className="process__pointer" aria-hidden="true" />
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
        </div>
      </div>
    </section>
  );
}

// Progress of the viewport's middle through the timeline (0 → 1), written as --p on the wrapper
// (fill scale, pointer offset); each stage gets data-reached once its dot is above that line.
// One rAF per scroll frame, transform only. Without JS the rail is simply unfilled.
function useScrollProgress() {
  const ref = useRef(null);
  useEffect(() => {
    const wrap = ref.current;
    if (!wrap) return;
    const steps = [...wrap.querySelectorAll('.process__step')];
    let frame = 0;
    const update = () => {
      frame = 0;
      const box = wrap.getBoundingClientRect();
      const line = window.innerHeight / 2;
      const p = Math.min(1, Math.max(0, (line - box.top) / box.height));
      wrap.style.setProperty('--p', p.toFixed(4));
      wrap.style.setProperty('--p-px', `${(p * box.height).toFixed(1)}px`);
      steps.forEach((s) => {
        const dot = s.querySelector('.process__rail');
        const r = dot.getBoundingClientRect();
        const marker = window.matchMedia('(max-width: 900px)').matches ? r.top + 42 : r.top + r.height / 2;
        s.toggleAttribute('data-reached', marker <= line);
      });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return ref;
}

// Peranan Sebenarnya.my: a tilt-stack. The section is n stages tall; one sticky stage holds the
// head and a deck where each card slides up tilted, lands flat, then tips back and dims as the
// next one lands on it. Scroll drives it (no timers); transform and opacity only. Reduced motion:
// cards crossfade in place. Every card's text is in the DOM, so nothing is hidden from readers.
const ROLE_PERSPECTIVE = 1400;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const pad2 = (n) => String(n).padStart(2, '0');

// Where card i sits at scroll position p (0 = first card, n - 1 = last)
function rolePose(p, i, reduced) {
  const enter = i === 0 ? 1 : clamp(p - (i - 1), 0, 1);
  const depth = clamp(p - i, 0, 3);
  if (reduced) return { y: 0, scale: 1, rx: 0, rz: 0, shade: Math.min(depth, 1) * 0.5, opacity: enter };
  const e = easeOut(enter);
  return {
    y: (1 - e) * 130 - depth * 3.2,
    scale: (1 - depth * 0.07) * (0.9 + 0.1 * e),
    rx: (1 - e) * 22 - depth * 9,
    rz: (1 - e) * (i % 2 ? 5 : -5),
    shade: Math.min(depth, 2) * 0.34,
    opacity: depth > 2.6 ? clamp((3 - depth) / 0.4, 0, 1) : 1,
  };
}

function Roles() {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const cardsRef = useRef([]);
  const shadesRef = useRef([]);
  const countRef = useRef(null);
  const railRef = useRef(null);
  const n = roles.cards.length;

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let last = -1;

    const paint = () => {
      frame = 0;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
      const progress = clamp((top - track.getBoundingClientRect().top) / travel, 0, 1);
      const p = progress * Math.max(n - 1, 0);
      for (let i = 0; i < n; i++) {
        const q = rolePose(p, i, mq.matches);
        const card = cardsRef.current[i];
        card.style.transform = `translate3d(0, ${q.y.toFixed(3)}%, 0) perspective(${ROLE_PERSPECTIVE}px) rotateX(${q.rx.toFixed(3)}deg) rotateZ(${q.rz.toFixed(3)}deg) scale(${q.scale.toFixed(4)})`;
        card.style.opacity = String(q.opacity);
        shadesRef.current[i].style.opacity = String(q.shade);
      }
      const idx = Math.round(p);
      if (idx !== last) {
        last = idx;
        countRef.current.textContent = pad2(idx + 1);
      }
      railRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };

    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    mq.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mq.removeEventListener('change', schedule);
    };
  }, [n]);

  return (
    <section className="about-roles" aria-labelledby="about-roles-title">
      <div className="roles-track" ref={trackRef} style={{ '--roles-n': n }}>
        <div className="roles-stage" ref={stageRef}>
          <div className="roles-head">
            <div className="roles-head__text">
              <Badge variant="eyebrow">{roles.badge}</Badge>
              <h2 className="about-title" id="about-roles-title">{roles.title}</h2>
            </div>
            <p className="roles-count" aria-hidden="true">
              <b ref={countRef}>01</b> / {pad2(n)}
              <span className="roles-count__rail"><i ref={railRef} /></span>
            </p>
          </div>

          <ol className="roles-deck">
            {roles.cards.map((c, i) => (
              <li
                key={c.title}
                className="roles-card"
                ref={(el) => { cardsRef.current[i] = el; }}
                style={{ zIndex: i + 1 }}
              >
                <img src={c.image} alt={c.alt} loading={i < 2 ? 'eager' : 'lazy'} draggable="false" />
                <div className="roles-card__body">
                  <span className="roles-card__num" aria-hidden="true">{pad2(i + 1)}</span>
                  <div className="roles-card__copy">
                    <h3 className="roles-card__title">{c.title}</h3>
                    <p className="roles-card__text">{c.text}</p>
                  </div>
                </div>
                <span className="roles-card__shade" ref={(el) => { shadesRef.current[i] = el; }} aria-hidden="true" />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// Berita dan Galeri: two rows of news and gallery photos drifting in opposite directions (top row
// left, bottom row right). Each row renders its cards twice so the loop is seamless; the copy is
// hidden from assistive tech and skipped by Tab. Hover pauses it. With reduced motion the rows stop
// and scroll by hand instead. Every card is a button that opens its photo in the shared modal
// (image only; Esc, the close button or the backdrop closes it, focus returns to the card).
function NewsMarquee({ rows }) {
  const dialogRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const open = (item) => {
    setSelected(item);
    dialogRef.current?.showModal();
    dialogRef.current?.focus(); // no focus ring on the close button at open
    document.documentElement.style.overflow = 'hidden';
  };
  const onClose = () => {
    document.documentElement.style.overflow = '';
  };

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
                      <button
                        type="button"
                        className="marquee-card__button"
                        aria-haspopup="dialog"
                        tabIndex={copy === 1 ? -1 : undefined}
                        onClick={() => open(n)}
                      >
                        <img src={n.image} alt={copy === 0 ? n.alt : ''} loading="lazy" draggable="false" />
                        <span className="marquee-card__body">
                          <Badge className="marquee-card__tag">{n.tag}</Badge>
                          {n.title && <span className="marquee-card__title">{n.title}</span>}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>

      <dialog
        tabIndex={-1}
        className="ui-modal gallery-dialog"
        ref={dialogRef}
        aria-label={selected?.title ?? selected?.alt}
        onClose={onClose}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
      >
        {selected && <img src={selected.image} alt={selected.alt} />}
        <IconButton variant="media" icon={X} label="Tutup foto" className="gallery-dialog__close" onClick={() => dialogRef.current.close()} />
      </dialog>
    </div>
  );
}

// Berita dan Galeri: one marquee of news and gallery photos
function NewsGallery() {
  const { marquee } = aboutNews;

  return (
    <section className="about-news" id="berita-galeri" aria-labelledby="about-news-title">
      <div className="about-news__head">
        <h2 className="about-title" id="about-news-title">
          {aboutNews.title}
        </h2>
        <p className="about-news-intro">{aboutNews.intro}</p>
      </div>

      <NewsMarquee rows={marquee} />
    </section>
  );
}
