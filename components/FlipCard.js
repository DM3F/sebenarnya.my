'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Icon from '@/components/ui/Icon';

const VERDICT_LABEL = { palsu: 'Palsu', waspada: 'Waspada', makluman: 'Makluman', benar: 'Penjelasan' };

/**
 * FactCheckCard (Paper › 06 Brand components › FactCheckCard – States).
 * Front: photo, verdict pill, title, agency avatar.
 * Back (rotateY 180°): verdict · agency, title, summary, checked date + source, "Baca semakan".
 * Controlled by the parent so only one card is open at a time (see Latest.js).
 * Mouse: flips on hover (with a short intent delay). Touch, click or keyboard: tap/click/Enter
 * toggles it, and keyboard focus moves to the side that is showing.
 *
 * `post` = { title, summary, image, alt, status, agency: { name, short, image }, date, dateLabel, href }
 */
export default function FlipCard({ post, flipped, onHover, onToggle }) {
  const frontBtnRef = useRef(null);
  const readRef = useRef(null);
  const byKeyboard = useRef(false);
  const verdict = VERDICT_LABEL[post.status] ?? post.status;

  // Hover only for a real mouse, so a tap on a phone doesn't flip twice
  const hover = (on) => (e) => {
    if (e.pointerType === 'mouse') onHover(on);
  };

  const toggle = (e) => {
    if (e.target.closest('a')) return; // "Baca semakan" just opens the article
    byKeyboard.current = e.detail === 0; // keyboard "clicks" have no click count
    onToggle();
  };

  // Keyboard users: move focus to the side that is now showing
  useEffect(() => {
    if (!byKeyboard.current) return;
    byKeyboard.current = false;
    (flipped ? readRef : frontBtnRef).current?.focus();
  }, [flipped]);

  return (
    <article
      className={`flip-card fc fc--${post.status}${flipped ? ' flipped' : ''}`}
      onPointerEnter={hover(true)}
      onPointerLeave={hover(false)}
      onClick={toggle}
    >
      <div className="flip-inner">
        {/* Front */}
        <div className="flip-face fc-front" inert={flipped}>
          <img className="fc-photo" src={post.image} alt={post.alt} loading="lazy" draggable={false} />
          <div className="fc-front-body">
            <span className="fc-pill">
              <span className="fc-dot" aria-hidden="true" />
              {verdict}
            </span>
            <h3 className="fc-title">{post.title}</h3>
          </div>
          <span className="fc-avatar" title={post.agency.name}>
            {post.agency.image ? (
              <img src={post.agency.image} alt={post.agency.short} loading="lazy" />
            ) : (
              <span className="fc-initials" aria-label={post.agency.short}>{post.agency.initials}</span>
            )}
          </span>
          <button
            ref={frontBtnRef}
            type="button"
            className="flip-toggle"
            aria-label={`Lihat ringkasan: ${post.title}`}
          />
        </div>

        {/* Back */}
        <div className="flip-face fc-back" inert={!flipped}>
          <div className="fc-back-body">
            <div className="fc-back-head">
              <span className="fc-verdict">
                <span className="fc-dot" aria-hidden="true" />
                <span className="fc-verdict-word">{verdict}</span>
                <span className="fc-agency">· {post.agency.short}</span>
              </span>
              <span className="fc-avatar fc-avatar--sm">
                {post.agency.image ? (
                  <img src={post.agency.image} alt="" loading="lazy" />
                ) : (
                  <span className="fc-initials" aria-hidden="true">{post.agency.initials}</span>
                )}
              </span>
            </div>
            <h3 className="fc-back-title">{post.title}</h3>
            <p className="fc-summary">{post.summary}</p>
            <div className="fc-meta">
              <span>
                Disemak <time dateTime={post.date}>{post.dateLabel}</time>
              </span>
              <span>Sumber: kenyataan rasmi {post.agency.short}</span>
            </div>
          </div>
          <Link ref={readRef} className="fc-read" href={post.href}>
            Baca semakan
            <span className="fc-read-icon" aria-hidden="true">
              <Icon icon={ArrowUpRight} />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
