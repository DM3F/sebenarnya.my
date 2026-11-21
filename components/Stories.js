'use client';

import { useState } from 'react';
import { stories, socialLinks } from '@/data/content';
import { ArrowUpRight, Calendar } from 'lucide-react';
import Icon from '@/components/ui/Icon';

const platforms = Object.fromEntries(socialLinks.map((p) => [p.id, p]));
const START = Math.floor(stories.length / 2); // open the middle card first

/**
 * Social media gallery (Home › Aktiviti media sosial terkini).
 * Elastic accordion: all five cards share one row; the open card takes four parts of the
 * width, the others one part each. Hover, focus or tap opens a card. No slider.
 * Motion: width eases on --ease-out; the open card's photo settles from 1.1 to 1 and its
 * text rises in after a short beat; folded cards are a platform-tinted ink panel with the icon centred.
 */
export default function Stories() {
  const [active, setActive] = useState(START);

  return (
    <div className="social-gallery">
      {stories.map((story, i) => {
        const open = i === active;
        const social = platforms[story.platform];

        return (
          <article
            key={story.href}
            className={`social-card social-card--${story.platform}${open ? ' is-open' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <img className="social-card__img" src={story.image} alt={story.alt} loading="lazy" draggable={false} />
            <div className="social-card__scrim" aria-hidden="true" />
            {/* Folded: platform-tinted ink panel; fades away to reveal the photo when the card opens */}
            <div className="social-card__tint" aria-hidden="true" />

            {/* Folded: platform icon only, centred */}
            <span className="social-card__brand" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d={social.icon} /></svg>
            </span>

            {/* Open: platform, date, title, summary, link out */}
            <div className="social-card__content">
              <div className="social-card__meta">
                <span className="social-card__badge">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={social.icon} /></svg>
                  {social.label}
                </span>
                {story.date && (
                  <span className="social-card__date">
                    <Icon icon={Calendar} size={14} />
                    {story.date}
                  </span>
                )}
              </div>
              <h3 className="social-card__title">{story.title}</h3>
              <p className="social-card__summary">{story.summary}</p>
              <a href={story.href} className="social-card__cta" target="_blank" rel="noopener noreferrer">
                Buka di {social.label}
                <span className="sr-only"> (tab baharu)</span>
                <Icon icon={ArrowUpRight} />
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
