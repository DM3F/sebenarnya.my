import { footerColumns, footerLegal, footerStatement, socialLinks } from '@/data/content';
import { withBase } from '@/lib/basePath';

/**
 * Footer on a dark band.
 * Row 1: statement on the leading side, three link columns on the trailing side.
 * Row 2: the "Tidak pasti jangan kongsi" badge and the sebenarnya.my wordmark.
 * Row 3: copyright and the legal links, one line above a hairline.
 * Column headings are labels, not page headings.
 */
export default function Footer() {
  const columns = [
    ...footerColumns.map((c) => ({ title: c.title, links: c.links.map((l) => ({ ...l, href: withBase(l.href) })) })),
    { title: 'Sosial', links: socialLinks.map((l) => ({ label: l.label, href: l.href, external: true })) },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <p className="site-footer__statement">{footerStatement}</p>

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

        <div className="site-footer__brand">
          <img
            className="site-footer__badge"
            src={withBase('/images/logo/footer-badge.png')}
            alt=""
            width="275"
            height="226"
            loading="lazy"
          />
          <img
            className="site-footer__wordmark"
            src={withBase('/images/logo/footer-wordmark.png')}
            alt="Sebenarnya.my: Tidak pasti, jangan kongsi"
            width="947"
            height="114"
            loading="lazy"
          />
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copy">
            &copy; 2026 Suruhanjaya Komunikasi dan Multimedia Malaysia. Hak cipta terpelihara.
          </p>
          <ul className="site-footer__legal" aria-label="Maklumat undang-undang">
            {footerLegal.map((l) => (
              <li key={l.label}>
                {l.href ? (
                  <a href={l.href}>{l.label}</a>
                ) : (
                  <span className="site-footer__legal-pending">
                    {l.label} <span className="site-footer__soon">(akan datang)</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
