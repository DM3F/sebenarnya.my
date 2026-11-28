import { partners } from '@/data/content';

// Agencies shown as the avatar stack beside the label (the full list scrolls in the ticker)
const STACK = partners.slice(0, 4);

// Label block (title, logo stack, one line of support) | endless ticker of logo cards.
// The list is rendered twice and the track slides from -50% to 0 (CSS), so it moves left to right
// and loops seamlessly.
export default function Collaborators() {
  return (
    <section className="partners container" aria-label="Sumber kenyataan rasmi">
      <div className="partners-inner">
        <div className="partners-intro">
          <p className="partners-label">Dengan Kerjasama</p>
          <div className="partners-intro__row">
            <ul className="partners-stack" aria-hidden="true">
              {STACK.map((p) => (
                <li key={p.name}>
                  <img src={p.logo} alt="" width="32" height="32" loading="lazy" />
                </li>
              ))}
            </ul>
            <p className="partners-intro__text">Disahkan oleh lebih 20 kementerian dan agensi kerajaan</p>
          </div>
        </div>

        <div className="partners-ticker">
          <ul className="partners-track">
            {[...partners, ...partners].map((p, i) => {
              const copy = i >= partners.length; // second set is only there for the loop
              return (
                <li key={i} className="partners-logo" aria-hidden={copy || undefined}>
                  <img src={p.logo} alt={copy ? '' : p.name} title={p.name} height="40" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
