'use client';

import { useEffect, useRef, useState } from 'react';
import { stories, socialLinks } from '@/data/content';
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar } from 'lucide-react';
import Icon from '@/components/ui/Icon';

const COUNT = stories.length;
const platforms = Object.fromEntries(socialLinks.map((p) => [p.id, p]));

// Three copies (before / real / after) so the side previews fill the screen and the loop looks endless
const slides = [...stories, ...stories, ...stories];

// Card widths and gap, measured against the row's own width (Paper: 3 folded cards
// + 1 open card fill the content width, gap 8, height 560)
function getSizes(rowWidth) {
  if (rowWidth <= 700) {
    return { small: Math.max(Math.round(rowWidth * 0.16), 56), big: Math.min(Math.round(rowWidth * 0.8), 380), gap: 8 };
  }
  const gap = 8;
  const small = Math.round(rowWidth * 0.153);
  return { small, big: rowWidth - 3 * small - 3 * gap, gap };
}

export default function Stories() {
  const viewportRef = useRef(null);
  const touchStartX = useRef(0);
  const [index, setIndex] = useState(COUNT + 2); // start on the 3rd story of the middle copy
  const [animate, setAnimate] = useState(false);
  const [size, setSize] = useState(null);

  // Measure on load and (debounced) on resize
  useEffect(() => {
    let timer;
    const measure = () => {
      setAnimate(false);
      const viewport = viewportRef.current.offsetWidth;
      setSize({ ...getSizes(viewport), viewport });
    };
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 80);
    };

    measure();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // After an instant (non-animated) jump has been painted, switch transitions back on
  useEffect(() => {
    if (animate || !size) return;
    let second;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [animate, size, index]);

  const goTo = (i) => setIndex(Math.max(0, Math.min(slides.length - 1, i)));

  // If we slid into one of the copies, jump back to the same story in the middle copy
  function handleTransitionEnd(e) {
    if (e.target !== e.currentTarget) return;
    if (index < COUNT || index >= COUNT * 2) {
      setAnimate(false);
      setIndex((index % COUNT) + COUNT);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(index + 1);
    }
  }

  function handleTouchEnd(e) {
    const distance = e.changedTouches[0].screenX - touchStartX.current;
    if (distance < -40) goTo(index + 1);
    else if (distance > 40) goTo(index - 1);
  }

  const s = size || { small: 219, big: 746, gap: 8, viewport: 0 };
  const offset = s.viewport / 2 - (index * (s.small + s.gap) + s.big / 2);
  const storyNumber = index % COUNT;
  const progress = 100 / COUNT + (storyNumber / (COUNT - 1)) * (100 - 100 / COUNT);
  const transition = animate ? undefined : 'none';

  return (
    <div className="stories">

      <div
        className="stories-viewport"
        ref={viewportRef}
        tabIndex={0}
        aria-label="Hantaran media sosial terkini kami"
        onKeyDown={handleKeyDown}
        onTouchStart={(e) => { touchStartX.current = e.changedTouches[0].screenX; }}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="stories-track"
          onTransitionEnd={handleTransitionEnd}
          style={{
            gap: s.gap,
            transform: `translateX(${offset}px)`,
            transition,
            visibility: size ? 'visible' : 'hidden',
          }}
        >
          {slides.map((story, i) => {
            const active = i === index;
            const linkTab = active ? undefined : -1;
            const social = platforms[story.platform];

            return (
              <article
                key={i}
                className={`story story-${story.platform}${active ? ' active' : ''}`}
                aria-hidden={i < COUNT || i >= COUNT * 2 ? true : undefined}
                style={{ width: active ? s.big : s.small, transition }}
                onClick={() => !active && goTo(i)}
              >
                {/* Platform logo, shown while the card is folded */}
                <svg className="story-brand" viewBox="0 0 24 24" aria-hidden="true"><path d={social.icon} /></svg>

                <div className="story-body">
                  <div className="story-meta">
                    <span className="story-badge">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d={social.icon} /></svg>
                      {social.label}
                    </span>
                    <span className="story-info">
                      <Icon icon={Calendar} size={14} />
                      {story.date}
                    </span>
                  </div>
                  <h3 className="story-title">
                    <a href={story.href} target="_blank" rel="noopener noreferrer" tabIndex={linkTab}>{story.title}</a>
                  </h3>
                  <p className="story-summary">{story.summary}</p>
                  <a href={story.href} className="story-open" target="_blank" rel="noopener noreferrer" tabIndex={linkTab}>
                    Buka di {social.label}
                    <Icon icon={ArrowUpRight} />
                  </a>
                </div>

                {/* The post itself; the player only loads on the open card */}
                <div className="story-media">
                  {active && (story.video ? (
                    <video src={story.video} poster={story.poster} controls playsInline preload="none" />
                  ) : story.embed ? (
                    <iframe
                      src={story.embed}
                      title={`${social.label}: ${story.title}`}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <a href={story.href} target="_blank" rel="noopener noreferrer">
                      <img src={story.image} alt={story.alt} />
                    </a>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="stories-footer">
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="stories-nav">
          <button className="round-btn" type="button" aria-label="Cerita Sebelumnya" onClick={() => goTo(index - 1)}>
            <Icon icon={ArrowLeft} size={20} />
          </button>
          <button className="round-btn" type="button" aria-label="Cerita Seterusnya" onClick={() => goTo(index + 1)}>
            <Icon icon={ArrowRight} size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
