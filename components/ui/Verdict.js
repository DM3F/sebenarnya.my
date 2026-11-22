const WORDS = {
  palsu: 'Palsu',
  makluman: 'Makluman',
  benar: 'Benar',
};

/**
 * Verdict — always dot + word (+ agency), so meaning never relies on colour alone.
 *   type:    palsu | makluman | benar — the only three verdicts (design.md §2)
 *   tone:    default (word in ink) | single (word in the verdict colour)
 *   variant: pill (default, 44px) | overlay (compact, on photos) | plain (no surface, inherits colour)
 */
export default function Verdict({ type = 'benar', tone = 'default', variant = 'pill', agency, label, className = '' }) {
  const key = WORDS[type] ? type : 'makluman';
  const word = label ?? WORDS[key];
  return (
    <span className={`ui-verdict ui-verdict--${key} ui-verdict--${tone} ui-verdict--${variant} ${className}`.trim()}>
      <span className="ui-verdict__dot" aria-hidden="true" />
      <span className="ui-verdict__word">{word}</span>
      {agency && <span className="ui-verdict__agency">· {agency}</span>}
    </span>
  );
}
