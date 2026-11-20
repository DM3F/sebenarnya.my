'use client';

import { useEffect, useRef, useState } from 'react';
import { Share } from 'lucide-react';
import Icon from '@/components/ui/Icon';

// Share links; {url} and {text} are filled in when the menu opens
const TARGETS = [
  { label: 'WhatsApp', href: 'https://wa.me/?text={text}%20{url}' },
  { label: 'Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u={url}' },
  { label: 'X', href: 'https://twitter.com/intent/tweet?text={text}&url={url}' },
  { label: 'Telegram', href: 'https://t.me/share/url?url={url}&text={text}' },
];

// "Kongsi" button: uses the phone's share sheet when there is one, otherwise a menu
export default function ShareButton({ title }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const wrapRef = useRef(null);

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !wrapRef.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const share = async () => {
    const pageUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: pageUrl });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // user closed the share sheet
      }
    }
    setUrl(pageUrl);
    setCopied(false);
    setOpen((o) => !o);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt('Salin pautan ini:', url);
    }
  };

  const fill = (href) => href.replace('{url}', encodeURIComponent(url)).replace('{text}', encodeURIComponent(title));

  return (
    <div className="share" ref={wrapRef}>
      <button type="button" className="share-btn" aria-expanded={open} aria-haspopup="true" onClick={share}>
        <Icon icon={Share} />
        Kongsi
      </button>

      {open && (
        <div className="share-menu">
          {TARGETS.map((t) => (
            <a key={t.label} href={fill(t.href)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              {t.label}
            </a>
          ))}
          <button type="button" onClick={copy} aria-live="polite">
            {copied ? 'Pautan disalin ✓' : 'Salin pautan'}
          </button>
        </div>
      )}
    </div>
  );
}
