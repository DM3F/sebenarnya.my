'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Share } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { Button } from '@/components/ui';

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
      <Button variant="outline" icon={Share} className="share-btn" aria-expanded={open} onClick={share}>
        Kongsi
      </Button>

      {open && (
        <div className="ui-menu share-menu">
          {TARGETS.map((t) => (
            <a key={t.label} className="ui-dropdown__item" href={fill(t.href)} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              {t.label}
            </a>
          ))}
          <button type="button" className="ui-dropdown__item" onClick={copy}>
            {copied ? 'Pautan disalin' : 'Salin pautan'}
            {copied && <Icon icon={Check} />}
          </button>
          <span className="ui-sr-only" role="status">{copied ? 'Pautan disalin' : ''}</span>
        </div>
      )}
    </div>
  );
}
