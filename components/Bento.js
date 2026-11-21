import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { withBase } from '@/lib/basePath';

/**
 * WSIS award banner.
 * Dark story card + trophy photo, 1.62 : 1, 560 tall on desktop.
 */
export default function Bento() {
  return (
    <div className="wsis-banner">
      <div className="wsis-banner__story">
        <div className="wsis-banner__top">
          <span className="wsis-banner__badge">Geneva · WSIS Pertubuhan Bangsa-Bangsa Bersatu</span>
          <h3 className="wsis-banner__heading">
            <span className="wsis-banner__eyebrow">Pengiktirafan tertinggi</span>
            <span className="wsis-banner__title">Juara Dunia</span>
            <span className="wsis-banner__sub">dalam Kepercayaan Digital &amp; Semakan Fakta Awam</span>
          </h3>
          <p className="wsis-banner__text">
            Apabila khabar angin tular tersebar pantas, fakta yang sahih mesti bergerak lebih pantas. Sebenarnya.my
            meraih penghormatan antarabangsa tertinggi di Anugerah WSIS PBB di Geneva — diiktiraf sebagai perisai utama
            Malaysia yang melindungi <strong>33 juta rakyat</strong> bersama <strong>lebih 20 agensi persekutuan</strong>.
          </p>
        </div>
        <Button variant="media" href={withBase('/about-us/#berita-galeri')} iconEnd={ArrowRight} className="wsis-banner__cta">
          Ketahui lebih lanjut
        </Button>
      </div>

      <div className="wsis-banner__media">
        <img
          src={withBase('/images/bento/wsis-prize-award.webp')}
          alt="Trofi Anugerah WSIS 2026, Geneva, Switzerland"
          loading="lazy"
        />
      </div>
    </div>
  );
}
