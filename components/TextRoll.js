// TextRoll: on hover (or keyboard focus) of its parent, each letter rolls up and an identical
// copy rolls in from below. Letters move one after another from the centre outwards.
// CSS only (global.css › .text-roll): transform, nothing else; no motion under reduced motion.
// The two letter rows are hidden from assistive tech; the plain text is read once.

const STAGGER_MS = 35;

export default function TextRoll({ children, className = '' }) {
  const text = String(children);
  const chars = [...text];
  const mid = (chars.length - 1) / 2;

  const row = (extra) => (
    <span className={`text-roll__row${extra}`} aria-hidden="true">
      {chars.map((c, i) => (
        <span key={i} className="text-roll__char" style={{ '--d': `${Math.round(Math.abs(i - mid) * STAGGER_MS)}ms` }}>
          {c === ' ' ? ' ' : c}
        </span>
      ))}
    </span>
  );

  return (
    <span className={`text-roll ${className}`.trim()}>
      {row('')}
      {row(' text-roll__row--next')}
      <span className="sr-only">{text}</span>
    </span>
  );
}
