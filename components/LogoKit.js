import { logoPage } from '@/data/content';
import { Download } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

// Logo section of Tentang Kami (/about-us/#logo): title, intro, and a card per file
// with a preview and a download button. Header › Tentang Kami › Logo links here.
export default function LogoKit({ headingLevel = 2 }) {
  const Title = `h${headingLevel}`;
  const Name = `h${headingLevel + 1}`;
  return (
    <section className="logo-kit" id="logo" aria-labelledby="logo-kit-title">
      <Title className="logo-kit-title" id="logo-kit-title">
        {logoPage.title}
      </Title>
      <p className="logo-kit-intro">{logoPage.intro}</p>

      <div className="logo-kit-grid">
        {logoPage.items.map((item) => (
          <article className="logo-card" key={item.name}>
            <div className="logo-card-preview">
              <img src={item.src} alt={`${item.name} Sebenarnya.my`} width={item.width} height={item.height} />
            </div>

            <div className="logo-card-info">
              <div>
                <Name>{item.name}</Name>
                <p>{item.text}</p>
                <p className="logo-card-meta">{item.meta}</p>
              </div>

              <Button
                variant="outline" /* two downloads side by side: none is the one primary action */
                className="logo-card-btn"
                href={item.file}
                download={item.filename}
                icon={<Icon icon={Download} />}
              >
                Muat turun
                <span className="sr-only"> {item.name} ({item.meta})</span>
              </Button>
            </div>
          </article>
        ))}
      </div>

      {logoPage.terms && (
        <div className="logo-terms">
          <Name className="logo-terms__title">{logoPage.terms.title}</Name>
          <p>{logoPage.terms.intro}</p>
          <ol className="logo-terms__list">
            {logoPage.terms.items.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ol>
          <p className="logo-terms__note">{logoPage.terms.note}</p>
        </div>
      )}
    </section>
  );
}
