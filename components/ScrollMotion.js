'use client';

import { useEffect } from 'react';

// [selector, delay in seconds]
const blocks = [
  // Hero
  ['.hero-title', 0.04],
  ['.hero-lede', 0.1],
  ['.hero-search-group', 0.14],
  ['.latest-checks__title', 0],
  ['.latest-checks__carousel', 0.08],
  // About us hero
  ['.about-hero-card', 0.04],
  ['.about-fn-title', 0],
  ['.about-title', 0],
  ['.about-news-intro', 0.08],
  // Logo page
  ['.logo-kit-title', 0],
  ['.logo-kit-intro', 0.08],
  ['.logo-card:nth-child(1)', 0.14],
  ['.logo-card:nth-child(2)', 0.22],
  // Stories
  ['.activity__title', 0],
  ['.stories-viewport', 0.08],
  ['.stories-footer', 0.16],
  // Home: WSIS banner, Tentang ringkas
  ['.wsis-banner', 0.08],
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

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return null;
}
