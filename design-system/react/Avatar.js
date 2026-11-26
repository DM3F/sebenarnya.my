'use client';

import { useState } from 'react';

/**
 * Avatar — a person or an agency. Falls back to initials when there is no image or it fails.
 *   src · alt (the name; empty when a name is printed next to it) · fallback ("KP") · size: md (40, default) · sm (32)
 */
export default function Avatar({ src, alt = '', fallback, size = 'md', className = '' }) {
  const [failed, setFailed] = useState(false);
  const initials = fallback ?? alt.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <span className={`ui-avatar${size === 'sm' ? ' ui-avatar--sm' : ''} ${className}`.trim()}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="ui-avatar__img" src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden={!alt} role={alt ? 'img' : undefined} aria-label={alt || undefined}>{initials}</span>
      )}
    </span>
  );
}
