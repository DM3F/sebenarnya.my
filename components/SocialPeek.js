'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Calendar, X } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { Button, IconButton } from '@/components/ui';
import { socialLinks, stories } from '@/data/content';

const platforms = Object.fromEntries(socialLinks.map((p) => [p.id, p]));

/**
 * SocialPeek — a row of platform logos; each opens a modal "sneak peek" of that
 * platform's latest post: badge, date, title, summary, the video (local clip or the
 * platform's own embed) and a link out. Native <dialog>: dark backdrop, Escape and
 * backdrop click close it, focus goes back to the logo that opened it.
 * Embeds mount only while open, so nothing third-party loads until asked for.
 */
export default function SocialPeek({ className = '' }) {
  const [active, setActive] = useState(null); // index into stories, or null
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);

  const story = active === null ? null : stories[active];
  const social = story ? platforms[story.platform] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (story && !dialog.open) { dialog.showModal(); dialog.focus(); } // focus the dialog, not the close button (no ring on open)
    if (!story && dialog.open) dialog.close();
  }, [story]);

  // Native close (Escape, close button, backdrop) → clear state and restore focus
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setActive(null);
      triggerRef.current?.focus();
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  const open = (i, e) => {
    triggerRef.current = e.currentTarget;
    setActive(i);
  };

  return (
    <>
      <ul className={`social-peek ${className}`.trim()} aria-label="Pratonton media sosial">
        {stories.map((s, i) => {
          const p = platforms[s.platform];
          return (
            <li key={s.platform}>
              <button
                type="button"
                className={`social-peek__logo social-peek__logo--${s.platform}`}
                aria-label={`Pratonton ${p.label}: ${s.title}`}
                aria-haspopup="dialog"
                onClick={(e) => open(i, e)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={p.icon} /></svg>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        tabIndex={-1}
        ref={dialogRef}
        className={`peek-modal${social ? ` peek-modal--${social.id}` : ''}`}
        aria-labelledby="peek-title"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
      >
        {story && (
          <div className="peek-modal__inner">
            <div className="peek-modal__body">
              <div className="peek-modal__meta">
                <span className="peek-modal__badge">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={social.icon} /></svg>
                  {social.label}
                </span>
                {story.date && (
                  <span className="peek-modal__date">
                    <Icon icon={Calendar} size={14} />
                    {story.date}
                  </span>
                )}
              </div>
              <h2 className="peek-modal__title" id="peek-title">{story.title}</h2>
              <p className="peek-modal__summary">{story.summary}</p>
              <Button
                href={story.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                iconEnd={ArrowUpRight}
                className="peek-modal__open"
              >
                Buka di {social.label}
              </Button>
            </div>

            <div className={`peek-modal__media${story.embed && !story.video ? ' peek-modal__media--embed' : ''}`}>
              {story.video ? (
                <video src={story.video} poster={story.image} controls playsInline autoPlay muted preload="metadata">
                  <track kind="captions" />
                </video>
              ) : story.embed ? (
                <iframe
                  src={story.embed}
                  title={`${social.label}: ${story.title}`}
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <img src={story.image} alt={story.alt} />
              )}
            </div>

            <IconButton
              icon={X}
              label="Tutup pratonton"
              variant="secondary"
              className="peek-modal__close"
              onClick={() => dialogRef.current.close()}
            />
          </div>
        )}
      </dialog>
    </>
  );
}
