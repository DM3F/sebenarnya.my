import { logoPage } from '@/data/content';
import FormatFolder from '@/components/FormatFolder';

// Logo section of Tentang Kami (/about-us/#logo): title, intro, a card per file (preview + the
// format folder with its downloads, no visible text), then the terms of use. Header › Tentang Kami › Logo links here.
export default function LogoKit({ headingLevel = 2 }) {
  const Title = `h${headingLevel}`;
  const Name = `h${headingLevel + 1}`;
  return (
    <section className="logo-kit" id="logo" aria-labelledby="logo-kit-title">
      <div className="logo-kit__head">
        <Title className="logo-kit-title" id="logo-kit-title">
          {logoPage.title}
        </Title>
        <p className="logo-kit-intro">{logoPage.intro}</p>
      </div>

      <div className="logo-kit-grid">
        {logoPage.items.map((item) => (
          <article className="logo-card" key={item.name}>
            {/* Heading kept for screen readers and the page outline; the card shows the file itself */}
            <Name className="sr-only">{item.name}</Name>

            <div className="logo-card__preview">
              <img src={item.src} alt={`${item.name} Sebenarnya.my`} width={item.width} height={item.height} />
            </div>

            <FormatFolder title={logoPage.formatTitle} subject={item.name} formats={item.formats} />
          </article>
        ))}
      </div>

      {logoPage.terms && (
        <div className="logo-terms">
          <Name className="logo-terms__title">{logoPage.terms.title}</Name>
          <div className="logo-terms__body">
            <p>{logoPage.terms.intro}</p>
            <ol className="logo-terms__list">
              {logoPage.terms.items.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
            <p className="logo-terms__note">{logoPage.terms.note}</p>
          </div>
        </div>
      )}
    </section>
  );
}
