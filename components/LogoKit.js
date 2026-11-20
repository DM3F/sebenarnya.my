import { logoPage } from '@/data/content';
import { Download } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';

// Logo page: title, intro, and a card per file with a preview and a download button
// headingLevel: 1 on the /logo page, 2 when it is a section of Tentang Kami
export default function LogoKit({ headingLevel = 1 }) {
  const Title = `h${headingLevel}`;
  const Name = `h${headingLevel + 1}`;
  return (
    <section className="logo-kit" aria-labelledby="logo-kit-title">
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
    </section>
  );
}
