'use client';

import { useEffect, useRef, useState } from 'react';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import Button, { IconButton } from './Button';
import Icon from './Icon';

/**
 * Toast — a short confirmation that goes away by itself ("Disimpan", "Diterbitkan").
 * Mount <Toaster /> once (in the app layout), then call toast() from anywhere:
 *   toast('Draf disimpan')
 *   toast({ title: 'Semakan diterbitkan', description: '…', variant: 'success', action: { label: 'Lihat', onClick } })
 * Stays 5s (pauses on hover and focus), announced politely. For errors the user must act on,
 * use an Alert in the page instead: a toast can be missed.
 */
let items = [];
let seq = 0;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l(items));

export function toast(input) {
  const t = { id: ++seq, duration: 5000, variant: 'default', ...(typeof input === 'string' ? { title: input } : input) };
  items = [...items, t].slice(-3); // three at most: older ones give way
  emit();
  return t.id;
}
toast.dismiss = (id) => {
  items = id === undefined ? [] : items.filter((t) => t.id !== id);
  emit();
};

const ICONS = { default: Info, success: CircleCheck, destructive: CircleAlert };

function ToastItem({ t }) {
  const timer = useRef(null);
  const start = () => {
    clearTimeout(timer.current);
    if (t.duration !== Infinity) timer.current = setTimeout(() => toast.dismiss(t.id), t.duration);
  };
  const pause = () => clearTimeout(timer.current);
  useEffect(() => { start(); return pause; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <li className="ui-toast" onPointerEnter={pause} onPointerLeave={start} onFocus={pause} onBlur={start}>
      <Icon icon={ICONS[t.variant] ?? Info} size="lg" />
      <div className="ui-toast__body">
        <span className="ui-toast__title">{t.title}</span>
        {t.description && <span className="ui-toast__description">{t.description}</span>}
        {t.action && (
          <Button variant="link" size="sm" onClick={() => { t.action.onClick?.(); toast.dismiss(t.id); }}>{t.action.label}</Button>
        )}
      </div>
      <IconButton icon={X} label="Tutup pemberitahuan" variant="quiet" size="icon-sm" onClick={() => toast.dismiss(t.id)} />
    </li>
  );
}

export function Toaster({ label = 'Pemberitahuan' }) {
  const [list, setList] = useState(items);
  useEffect(() => {
    listeners.add(setList);
    return () => listeners.delete(setList);
  }, []);
  return (
    <ol className="ui-toaster" aria-label={label} aria-live="polite" aria-relevant="additions">
      {list.map((t) => <ToastItem key={t.id} t={t} />)}
    </ol>
  );
}
