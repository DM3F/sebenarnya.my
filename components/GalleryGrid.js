'use client';

// Galeri (Tentang Kami): two-column photo grid. Each section is one cell of the grid:
// `single` is one tall photo, `grid` is a 2 × 2 block of square photos. A lone last section
// spans both columns. Every photo opens in the shared modal (image only; Esc or backdrop closes).
import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { IconButton } from '@/components/ui';

export default function GalleryGrid({ sections }) {
  const dialogRef = useRef(null);
  const [selected, setSelected] = useState(null);

  const open = (item) => {
    setSelected(item);
    dialogRef.current?.showModal();
    dialogRef.current?.focus(); // no focus ring on the close button at open
    document.documentElement.style.overflow = 'hidden';
  };
  const onClose = () => {
    document.documentElement.style.overflow = '';
  };

  return (
    <div className="gallery-grid">
      {sections.map((section, s) => (
        <ul className={`gallery-grid__section gallery-grid__section--${section.type ?? 'single'}`} key={s}>
          {section.images.map((item) => (
            <li key={item.image}>
              <button type="button" className="gallery-grid__tile" aria-label={`Besarkan foto: ${item.caption}`} onClick={() => open(item)}>
                <img src={item.image} alt="" loading="lazy" draggable={false} />
              </button>
            </li>
          ))}
        </ul>
      ))}

      <dialog
        tabIndex={-1}
        className="ui-modal gallery-dialog"
        ref={dialogRef}
        aria-label={selected?.caption}
        onClose={onClose}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
      >
        {selected && <img src={selected.image} alt={selected.caption} />}
        <IconButton variant="media" icon={X} label="Tutup foto" className="gallery-dialog__close" onClick={() => dialogRef.current.close()} />
      </dialog>
    </div>
  );
}
