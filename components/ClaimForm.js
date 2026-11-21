'use client';

import { useEffect, useRef, useState } from 'react';
import { withBase } from '@/lib/basePath';
import { Check, CloudUpload, Flag, Link, X } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { Button, IconButton } from '@/components/ui';

// "Lapor berita tular" form, shown as a pop-up on every page.
// Any link pointing to CLAIM_HREF (header nav, footer, AIFA chatbot) opens it instead of navigating.
// There is no backend yet: `sendReport` only simulates a request. Replace it with a call to an API route later.

export const CLAIM_HREF = '/submit-claim/';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED = ['image/jpeg', 'image/png', 'application/pdf'];
const EMPTY = { name: '', email: '', subject: '', source: '', message: '' };

const FIELD_ORDER = ['name', 'email', 'subject', 'source', 'message'];

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Sila masukkan nama anda.';
  if (!values.email.trim()) errors.email = 'Sila masukkan e-mel anda.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Format e-mel tidak sah. Contoh: nama@contoh.com';
  if (!values.subject.trim()) errors.subject = 'Sila masukkan subjek laporan.';
  if (!values.source.trim()) errors.source = 'Sila nyatakan pautan atau sumber berita ini.';
  if (!values.message.trim()) errors.message = 'Sila terangkan berita yang anda terima.';
  return errors;
}

function checkFile(file) {
  if (!ACCEPTED.includes(file.type)) return 'Hanya fail jpg, png atau pdf diterima.';
  if (file.size > MAX_SIZE) return 'Fail melebihi 10MB. Sila pilih fail yang lebih kecil.';
  return '';
}

function formatSize(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Placeholder for the real submission. Swap with e.g. fetch('/api/claims', { method: 'POST', body: formData }).
function sendReport(_report) {
  return new Promise((resolve) => setTimeout(resolve, 900));
}

export default function ClaimForm() {
  const dialogRef = useRef(null);
  const fileInputRef = useRef(null);
  const pressedOnBackdrop = useRef(false);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setFile(null);
    setFileError('');
    setStatus('idle');
  };

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    if (status === 'sent') reset();
    dialog.showModal();
  };

  const close = () => dialogRef.current?.close();

  // Open the form from any "Submit claim" link on the page
  useEffect(() => {
    const onClick = (e) => {
      const link = e.target.closest?.(`a[href="${withBase(CLAIM_HREF)}"]`);
      if (!link) return;
      e.preventDefault();
      open();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [status]);

  // Stop the page behind from scrolling while the form is open
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const lock = () => (document.documentElement.style.overflow = dialog.open ? 'hidden' : '');
    const observer = new MutationObserver(lock);
    observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    return () => {
      observer.disconnect();
      document.documentElement.style.overflow = '';
    };
  }, []);

  const update = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: undefined }));
  };

  const pickFile = (picked) => {
    if (!picked) return;
    const problem = checkFile(picked);
    setFileError(problem);
    setFile(problem ? null : picked);
  };

  const removeFile = () => {
    setFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = FIELD_ORDER.find((f) => found[f]);
    if (firstInvalid) {
      dialogRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus('sending');
    await sendReport({ ...values, file });
    setStatus('sent');
  };

  // Close when the dark backdrop is clicked (but not when a text selection drag ends there)
  const onPointerDown = (e) => (pressedOnBackdrop.current = e.target === dialogRef.current);
  const onBackdropClick = (e) => {
    if (pressedOnBackdrop.current && e.target === dialogRef.current) close();
    pressedOnBackdrop.current = false;
  };

  const field = (name, label, props = {}) => (
    <div className="ui-field claim-field">
      <label htmlFor={`claim-${name}`} className="ui-label">
        {label}
        <span className="ui-label__required" aria-hidden="true"> *</span>
      </label>
      <input
        className="ui-input"
        id={`claim-${name}`}
        name={name}
        value={values[name]}
        onChange={update}
        aria-required="true"
        aria-invalid={errors[name] ? 'true' : undefined}
        aria-describedby={errors[name] ? `claim-${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p className="ui-field__error" id={`claim-${name}-error`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <dialog
      ref={dialogRef}
      className="claim-modal"
      aria-labelledby={status === 'sent' ? 'claim-done-title' : 'claim-title'}
      aria-describedby={status === 'sent' ? undefined : 'claim-desc'}
      onPointerDown={onPointerDown}
      onClick={onBackdropClick}
    >
      {/* Sent state is a bare confirmation: no header, closes with Esc or a backdrop click */}
      {status !== 'sent' && (
        <header className="claim-head">
          <span className="claim-icon" aria-hidden="true">
            <Icon icon={Flag} size={20} />
          </span>
          <div className="claim-heading">
            <h2 id="claim-title">Lapor berita tular</h2>
            <p id="claim-desc">Hantar berita atau mesej yang meragukan supaya pasukan kami boleh menyemaknya.</p>
          </div>
          <IconButton variant="ghost" icon={X} label="Tutup borang" className="claim-close" onClick={close} />
        </header>
      )}

      {status === 'sent' ? (
        <div className="claim-done" role="status">
          <span className="claim-done-icon" aria-hidden="true">
            <Icon icon={Check} size={28} />
          </span>
          <h3 id="claim-done-title">Laporan anda telah dihantar.</h3>
        </div>
      ) : (
        <form className="claim-form-body" onSubmit={onSubmit} noValidate>
          <div className="claim-scroll">
            <div className="claim-grid">
              {field('name', 'Nama', { type: 'text', placeholder: 'Nama penuh anda', autoComplete: 'name', maxLength: 120 })}
              {field('email', 'E-mel', { type: 'email', placeholder: 'nama@contoh.com', autoComplete: 'email', inputMode: 'email', maxLength: 160 })}
              {field('subject', 'Subjek', { type: 'text', placeholder: 'Contoh: Jadual bayaran STR Fasa 4', maxLength: 160 })}
              <div className="ui-field claim-field">
                <label htmlFor="claim-source" className="ui-label">
                  Sumber / URL<span className="ui-label__required" aria-hidden="true"> *</span>
                </label>
                <span className="ui-input-wrap">
                  <Icon icon={Link} />
                  <input
                    className="ui-input"
                    id="claim-source"
                    name="source"
                    type="text"
                    value={values.source}
                    onChange={update}
                    placeholder="https:// atau nama kumpulan WhatsApp"
                    maxLength={500}
                    aria-required="true"
                    aria-invalid={errors.source ? 'true' : undefined}
                    aria-describedby={errors.source ? 'claim-source-error' : undefined}
                  />
                </span>
                {errors.source && (
                  <p className="ui-field__error" id="claim-source-error">
                    {errors.source}
                  </p>
                )}
              </div>
            </div>

            <div className="ui-field claim-field">
              <span className="ui-label" id="claim-file-label">Tangkapan skrin</span>
              <p className="ui-field__hint" id="claim-file-hint">
                Seret tangkapan skrin mesej atau hantaran yang tular ke sini (pilihan).
              </p>

              {file ? (
                <div className="claim-file">
                  <span className="claim-file-icon" aria-hidden="true">
                    {file.type === 'application/pdf' ? 'PDF' : 'IMG'}
                  </span>
                  <div className="claim-file-meta">
                    <strong>{file.name}</strong>
                    <span>{formatSize(file.size)}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={removeFile} aria-label={`Buang fail ${file.name}`}>
                    Buang
                  </Button>
                </div>
              ) : (
                <div
                  className={dragging ? 'claim-drop dragging' : 'claim-drop'}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <Icon icon={CloudUpload} size={40} />
                  <strong>Pilih fail atau seret ke sini.</strong>
                  <span>jpg, png, pdf · maksimum 10MB</span>
                  <label className="ui-btn ui-btn--outline ui-btn--sm claim-pick">
                    Pilih fail
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      aria-labelledby="claim-file-label"
                      aria-describedby={fileError ? 'claim-file-error' : 'claim-file-hint'}
                      onChange={(e) => pickFile(e.target.files?.[0])}
                    />
                  </label>
                </div>
              )}
              {fileError && (
                <p className="ui-field__error" id="claim-file-error" role="alert">
                  {fileError}
                </p>
              )}
            </div>

            <div className="ui-field claim-field">
              <label htmlFor="claim-message" className="ui-label">
                Mesej<span className="ui-label__required" aria-hidden="true"> *</span>
              </label>
              <textarea
                className="ui-textarea"
                id="claim-message"
                name="message"
                rows={4}
                value={values.message}
                onChange={update}
                placeholder="Terangkan apa yang anda terima dan mengapa anda ragu-ragu."
                maxLength={3000}
                aria-required="true"
                aria-invalid={errors.message ? 'true' : undefined}
                aria-describedby={errors.message ? 'claim-message-error' : undefined}
              />
              {errors.message && (
                <p className="ui-field__error" id="claim-message-error">
                  {errors.message}
                </p>
              )}
            </div>

            <details className="claim-more">
              <summary>Saluran aduan lain</summary>
              <ul>
                <li>
                 Portal Aduan : https://aduan.mcmc.gov.my/#/public/main
                </li>
                <li>
                  Talian Aduan : 1800 – 188 – 030
                </li>
                <li>
                  Faksimili       : 03 – 8688 1880
                </li>
                <li>
                  Whatsapp     : 016 - 220 6262
                </li>
                <li>
                  Emel            : aduanskmm@mcmc.gov.my 
                </li>
              </ul>
            </details>

            <p className="claim-privacy">
              Borang ini tidak mengumpul nama atau e-mel anda secara automatik melainkan anda mengisinya sendiri. Jangan
              sekali-kali berikan kata laluan anda.
            </p>
          </div>

          <div className="claim-foot">
            <Button type="submit" className="claim-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Menghantar…' : 'Hantar laporan'}
            </Button>
          </div>
        </form>
      )}
    </dialog>
  );
}
