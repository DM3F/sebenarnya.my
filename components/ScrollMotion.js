'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Headings that rise line by line out of a mask as they scroll in (one-time, page-level only:
// body copy, cards and data stay still). [selector, delay in seconds]
const lineBlocks = [
  ['.hero-title', 0.1],
  ['.post-title', 0.1],
  ['.latest-checks__title', 0],
  ['.kenali__title', 0],
  ['.viewership-kicker', 0],
  ['.viewership-lead', 0.1],
  ['.about-title', 0],
  ['.about-subtitle', 0],
  ['.logo-kit-title', 0],
];

// [selector, delay in seconds]
const blocks = [
  // Hero
  ['.hero-lede', 0.1],
  ['.hero-search-group', 0.14],
  ['.latest-checks__carousel', 0.08],
  // About us hero
  ['.about-hero-card', 0.04],
  ['.about-news-intro', 0.08],
  // Logo page
  ['.logo-kit-intro', 0.08],
  ['.logo-card:nth-child(1)', 0.14],
  ['.logo-card:nth-child(2)', 0.22],
  // Kenali Sebenarnya.my: cards rise in with a short, uneven stagger
  ['.kenali__lead', 0.08],
  ['.kenali__card--channels', 0.06],
  ['.kenali__card--photo', 0.12],
  ['.kenali__card--visitors', 0.18],
  ['.kenali__card--poster', 0.22],
  ['.kenali__card--award', 0.27],
  ['.kenali__card--social', 0.3],
  // Aktiviti media sosial
  // Home: Tentang ringkas
  ['.viewership-inner', 0],
  ['.partners-inner', 0.08],
  // Footer
  ['.site-footer__top', 0.12],
];

// Fades and slides sections in as they scroll into view (styles under "Scroll motion" in global.css)
export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.classList.add('motion');

    const registered = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.06 }
    );

    function register(el, delay) {
      if (registered.has(el)) return;
      registered.add(el);
      el.classList.add('reveal');
      if (delay) el.style.transitionDelay = `${delay}s`;

      el.addEventListener('transitionend', function onEnd(e) {
        if (e.target === el && e.propertyName === 'transform') {
          el.classList.add('done');
          el.removeEventListener('transitionend', onEnd);
        }
      });

      observer.observe(el);
    }

    blocks.forEach(([selector, delay]) => {
      document.querySelectorAll(selector).forEach((el) => register(el, delay));
    });

    // Show anything already on screen straight away
    const frame = requestAnimationFrame(() => {
      const screenHeight = window.innerHeight;
      registered.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < screenHeight * 0.95 && rect.bottom > 0) {
          el.classList.add('in');
          observer.unobserve(el);
        }
      });
    });

    // Line reveal (same feel as the reference: 100% → 0 inside a per-line mask, power4.out)
    const splits = [];
    lineBlocks.forEach(([selector, delay]) => {
      document.querySelectorAll(selector).forEach((el) => {
        splits.push(
          SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'split-line', // its mask wrapper is padded in global.css (div:has(> .split-line)) so glyphs aren't cut
            autoSplit: true, // re-split when fonts load or the width changes
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 120,
                duration: 0.9,
                stagger: 0.08,
                ease: 'power4.out',
                delay,
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
                // Hand the heading back as plain text: no masks left to clip it on resize or zoom
                onComplete: () => self.revert(),
              }),
          }),
        );
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      splits.forEach((s) => s.revert());
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
