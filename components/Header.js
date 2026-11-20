'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { Button, NavLink, Tabs } from '@/components/ui';
import { CLAIM_HREF } from './ClaimForm';
import { navLinks } from '@/data/content';
import { withBase } from '@/lib/basePath';

const languages = [
  { value: 'BM', label: 'BM', lang: 'ms', title: 'Bahasa Melayu' },
  { value: 'EN', label: 'EN', lang: 'en', title: 'English' },
];

// "Salur Kepada Kami" is the header's action button, not a nav link
const pageLinks = navLinks.filter((link) => link.href !== CLAIM_HREF);
const claimLink = navLinks.find((link) => link.href === CLAIM_HREF);

const trim = (path) => (path.length > 1 ? path.replace(/\/$/, '') : path);
const isCurrent = (pathname, href) =>
  href === '/' ? trim(pathname) === '/' : trim(pathname).startsWith(trim(href));

export default function Header() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState('BM'); // UI state only; content is not translated yet

  // Close the compact menu if the window grows back to desktop size
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1101px)');
    const close = (e) => e.matches && setOpen(false);
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  return (
    <header className="header">
      <div className="header-inner container">
        <div className="brand">
          <Logo />
        </div>

        <nav id="site-menu" className={open ? 'menu open' : 'menu'} aria-label="Utama">
          <ul>
            {pageLinks.map((link) => (
              <li key={link.href}>
                <NavLink href={withBase(link.href)} current={isCurrent(pathname, link.href)}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            {claimLink && (
              <li className="menu-claim">
                <NavLink href={withBase(claimLink.href)}>{claimLink.label}</NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-actions">
          {/* Language selector: visual only for now, no translation wired up */}
          <Tabs mode="toggle" label="Bahasa" items={languages} value={lang} onChange={setLang} />
          {claimLink && (
            <Button href={withBase(claimLink.href)} className="header-claim">
              {claimLink.label}
            </Button>
          )}
          <button
            type="button"
            className={open ? 'menu-toggle open' : 'menu-toggle'}
            aria-label="Menu"
            aria-controls="site-menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span>
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
