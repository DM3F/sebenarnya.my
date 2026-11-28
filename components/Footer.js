import Logo from './Logo';
import { footerColumns, socialLinks } from '@/data/content';
import { withBase } from '@/lib/basePath';

/**
 * Footer.
 * Brand block on the leading side, three link columns on the trailing side,
 * copyright underneath. Column headings are labels, not page headings.
 */
export default function Footer() {
  const columns = [
    { title: 'Sosial', links: socialLinks.map((l) => ({ label: l.label, href: l.href, external: true })) },
    ...footerColumns.map((c) => ({ title: c.title, links: c.links.map((l) => ({ ...l, href: withBase(l.href) })) })),
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div className="site-footer__brand">
          <Logo />
          <p className="site-footer__text">
            Sebenarnya.my membantu orang ramai mendapatkan maklumat sahih dan maklum balas rasmi, menyemak dakwaan yang tular serta mengikuti berita dan perkembangan terkini.
          </p>
        </div>

        <nav className="site-footer__links" aria-label="Pautan kaki">
          {columns.map((column) => (
            <div className="site-footer__col" key={column.title}>
              <p className="site-footer__heading">{column.title}</p>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <p className="site-footer__copy">
        &copy; 2026 Suruhanjaya Komunikasi dan Multimedia Malaysia.
      </p>
    </footer>
  );
}
