'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { Button, DropdownMenu, LanguageMenu, NavLink } from '@/components/ui';
import { claimLink, navLinks } from '@/data/content';
import { withBase } from '@/lib/basePath';

const languages = [
  { value: 'BM', label: 'Bahasa Melayu', lang: 'ms' },
  { value: 'EN', label: 'English', lang: 'en' },
];

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

  // Close the compact menu after navigating
  useEffect(() => setOpen(false), [pathname]);

  // Publish the sticky header's height so anchor jumps (scroll-padding-top in global.css) clear it
  const headerRef = useRef(null);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const root = document.documentElement;
    const publish = () => root.style.setProperty('--header-height', `${el.offsetHeight}px`);
    // Set it now too: PageTransition's anchor jump runs before the observer's first callback
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Soft shadow once the page leaves the very top (styled in global.css)
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 0); // React skips the render when the value is unchanged
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <header className="header" ref={headerRef} data-scrolled={scrolled || undefined}>
      <div className="header-inner">
        <div className="brand">
          <Logo />
        </div>

        {/* Desktop nav (>1100px): links + "Tentang Kami" dropdown */}
        <nav className="nav-desktop" aria-label="Utama">
          <ul>
            {navLinks.map((link) => (
              <li key={link.label}>
                {link.children ? (
                  <DropdownMenu
                    label={link.label}
                    current={link.children.some((c) => isCurrent(pathname, c.href))}
                    items={link.children.map((c) => ({
                      label: c.label,
                      href: withBase(c.href),
                      current: isCurrent(pathname, c.href),
                    }))}
                  />
                ) : (
                  <NavLink href={withBase(link.href)} current={isCurrent(pathname, link.href)}>
                    {link.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          {/* Language selector: visual only for now, no translation wired up */}
          <LanguageMenu label="Bahasa" items={languages} value={lang} onChange={setLang} />
          {/* Home's hero already has the one filled action ("Semak"), so the claim button steps back to outline there */}
          <Button
            href={withBase(claimLink.href)}
            variant={trim(pathname) === '/' ? 'outline' : 'filled'}
            className="header-claim"
          >
            {claimLink.label}
          </Button>
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

        {/* Compact menu (<=1100px): dropdown children are listed flat under their group */}
        {/* Any link in the compact menu closes it: the claim link opens the form without navigating,
            and same-page links (#logo) don't change the path */}
        <nav
          id="site-menu"
          className={open ? 'menu-panel open' : 'menu-panel'}
          aria-label="Utama"
          onClick={(e) => e.target.closest('a') && setOpen(false)}
        >
          <ul>
            {navLinks.map((link) =>
              link.children ? (
                <li key={link.label} className="menu-group">
                  <span className="menu-group-label">{link.label}</span>
                  <ul>
                    {link.children.map((c) => (
                      <li key={c.href}>
                        <NavLink href={withBase(c.href)} current={isCurrent(pathname, c.href)}>
                          {c.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={link.href}>
                  <NavLink href={withBase(link.href)} current={isCurrent(pathname, link.href)}>
                    {link.label}
                  </NavLink>
                </li>
              ),
            )}
            <li className="menu-claim">
              <NavLink href={withBase(claimLink.href)}>{claimLink.label}</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
