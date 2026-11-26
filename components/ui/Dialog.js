'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CircleAlert, X } from 'lucide-react';
import Button, { IconButton } from './Button';
import Icon from './Icon';

/**
 * Dialog — a window over the page for a short task (edit a title, pick an agency).
 * Native <dialog> + showModal(): focus stays inside, the page behind is inert, Escape closes.
 *
 *   <Dialog open={open} onOpenChange={setOpen} title="Sunting tajuk" description="…"
 *     footer={<><Button variant="outline" onClick={() => setOpen(false)}>Batal</Button><Button>Simpan</Button></>}>
 *     <Field label="Tajuk"><Input defaultValue="…" /></Field>
 *   </Dialog>
 *
 *   size: sm (400) · md (520, default) · lg (720)
 *   dismissible: false keeps it open on a scrim click (Escape still closes unless `busy`)
 *   busy: true while saving — Escape and the close button do nothing
 * Put data-autofocus on the control that should take focus first; otherwise the first control does.
 */
export function Dialog({
  open, onOpenChange, title, description, children, footer, size = 'md', role = 'dialog',
  dismissible = true, busy = false, showClose = true, icon, className = '',
}) {
  const ref = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // React's autoFocus runs before showModal(); data-autofocus picks the first control after it
      d.querySelector('[data-autofocus]')?.focus();
    }
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      role={role === 'alertdialog' ? 'alertdialog' : undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      aria-busy={busy || undefined}
      className={`ui-modal ui-dialog${size !== 'md' ? ` ui-dialog--${size}` : ''} ${className}`.trim()}
      // Escape: the browser fires `cancel` first
      onCancel={(e) => { e.preventDefault(); if (!busy) onOpenChange?.(false); }}
      onClose={() => open && onOpenChange?.(false)}
      onClick={(e) => dismissible && !busy && e.target === e.currentTarget && onOpenChange?.(false)}
    >
      {open && (
        <>
          <div className="ui-dialog__header">
            {icon}
            <div className="ui-dialog__heading">
              <h2 className="ui-dialog__title" id={titleId}>{title}</h2>
              {description && <p className="ui-dialog__description" id={descId}>{description}</p>}
            </div>
            {showClose && (
              <IconButton icon={X} label="Tutup" variant="quiet" size="icon-sm" className="ui-dialog__close"
                disabled={busy} onClick={() => onOpenChange?.(false)} />
            )}
          </div>
          {children && <div className="ui-dialog__body">{children}</div>}
          {footer && <div className="ui-dialog__footer">{footer}</div>}
        </>
      )}
    </dialog>
  );
}

/**
 * ConfirmDialog — a decision before an action that matters (padam, terbit, hantar kepada agensi).
 * role="alertdialog": no close button and no scrim click, the user picks Batal or the action.
 *
 *   <ConfirmDialog open={open} onOpenChange={setOpen} variant="destructive"
 *     title="Padam semakan ini?" description="Semakan dan sejarahnya dibuang. Tindakan ini tidak boleh dibatalkan."
 *     confirmLabel="Padam" pendingLabel="Memadam…" onConfirm={() => api.delete(id)} />
 *
 *   onConfirm may return a promise: the button shows pendingLabel, the dialog waits, closes when it
 *   resolves, and stays open with the error when it rejects.
 *   variant: default · destructive. Destructive adds a warning mark and starts focus on Batal, so
 *   Enter never deletes by accident. Actions are never red (design.md): the verb carries it.
 */
export function ConfirmDialog({
  open, onOpenChange, title, description, children, confirmLabel = 'Teruskan', cancelLabel = 'Batal',
  pendingLabel, variant = 'default', onConfirm, onCancel,
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const destructive = variant === 'destructive';

  useEffect(() => { if (open) setError(null); }, [open]);

  // While pending the buttons are aria-disabled, not disabled: a disabled button drops keyboard focus
  const cancel = () => { if (pending) return; onCancel?.(); onOpenChange?.(false); };
  const confirm = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      await onConfirm?.();
      onOpenChange?.(false);
    } catch (e) {
      setError(e?.message || 'Tidak berjaya. Cuba lagi.');
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && cancel()}
      role="alertdialog"
      size="sm"
      dismissible={false}
      showClose={false}
      busy={pending}
      title={title}
      description={description}
      icon={destructive ? <span className="ui-dialog__icon"><Icon icon={CircleAlert} size="lg" /></span> : null}
      footer={
        <>
          <Button variant="outline" onClick={cancel} aria-disabled={pending || undefined} data-autofocus={destructive || undefined}>{cancelLabel}</Button>
          <Button onClick={confirm} aria-disabled={pending || undefined} aria-busy={pending || undefined} data-autofocus={!destructive || undefined}>
            {pending ? (pendingLabel ?? `${confirmLabel}…`) : confirmLabel}
          </Button>
        </>
      }
    >
      {children}
      {error && <p className="ui-dialog__error" role="alert">{error}</p>}
    </Dialog>
  );
}

/**
 * confirmDialog() — the same decision without managing state. Mount <ConfirmDialogHost /> once.
 *   if (await confirmDialog({ title: 'Terbitkan semakan ini?', confirmLabel: 'Terbitkan' })) publish();
 *   await confirmDialog({ …, variant: 'destructive', onConfirm: () => api.delete(id) }) // waits for it
 * Resolves true when confirmed (after onConfirm succeeds), false when cancelled.
 */
let current = null;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l(current));

export function confirmDialog(options) {
  return new Promise((resolve) => {
    current?.resolve(false); // a new question replaces an unanswered one
    current = { ...options, resolve, key: Date.now() };
    emit();
  });
}

export function ConfirmDialogHost() {
  const [req, setReq] = useState(current);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const l = (r) => { setReq(r); setOpen(!!r); };
    listeners.add(l);
    return () => listeners.delete(l);
  }, []);
  if (!req) return null;
  const finish = (ok) => { req.resolve(ok); if (current === req) current = null; setOpen(false); };
  const { resolve, key, onConfirm, ...props } = req;
  return (
    <ConfirmDialog
      key={key}
      {...props}
      open={open}
      onOpenChange={(v) => !v && finish(false)}
      onCancel={() => finish(false)}
      onConfirm={async () => { await onConfirm?.(); finish(true); }}
    />
  );
}
