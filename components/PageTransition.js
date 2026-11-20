'use client';

// Page transition ported from the static-site version (app.js):
// intercept internal link clicks, run document.startViewTransition, and let the
// Next router swap the page inside it. The animation itself is CSS in global.css
// (::view-transition-old/new(root)).
import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BASE_PATH } from '@/lib/basePath';
import { CLAIM_HREF } from '@/components/ClaimForm';

const stripBase = (path) =>
  BASE_PATH && path.startsWith(BASE_PATH) ? path.slice(BASE_PATH.length) || '/' : path;

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const finish = useRef(null);

  // New page rendered → let the browser take the "new" snapshot
  useEffect(() => {
    if (!finish.current) return;
    window.scrollTo(0, 0);
    finish.current();
    finish.current = null;
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (!document.startViewTransition) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const link = e.target.closest?.('a[href]');
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download')) return;

      const url = new URL(link.href);
      if (url.origin !== location.origin) return;

      const path = stripBase(url.pathname);
      if (path === CLAIM_HREF) return; // opens the claim pop-up instead
      if (path === stripBase(location.pathname)) return; // same page / #hash links

      // Take over from <Link> so the old snapshot is captured before React swaps the page
      e.preventDefault();
      e.stopPropagation();

      document.startViewTransition(
        () =>
          new Promise((resolve) => {
            finish.current = resolve;
            router.push(path + url.search + url.hash, { scroll: false });
            setTimeout(resolve, 3000); // safety: never freeze the page
          })
      );
    };

    // Capture phase: runs before <Link>'s own click handler
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [router]);

  return null;
}
