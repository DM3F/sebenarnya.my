import { ArrowRight, Globe, MessageSquareText, Smartphone, Trophy } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Verdict from '@/components/ui/Verdict';
import { Button } from '@/components/ui';
import { withBase } from '@/lib/basePath';
import SocialPeek from '@/components/SocialPeek';

// "Kenali Sebenarnya.my": a 3-column bento about the service.
// Desktop areas: channels | photo (3 rows) | verdicts
//                poster   | photo          | award "Juara Dunia" (2 rows)
//                social   | photo          | award

export default function KenaliSebenarnya() {
  return (
    <section className="kenali" aria-labelledby="kenali-title">
      <div className="kenali__head">
        <h2 className="kenali__title" id="kenali-title">Kenali Sebenarnya.my</h2>
        <p className="kenali__lead">Saluran semakan, jawapan yang jelas dan pengiktirafan dunia, dalam satu pandangan.</p>
      </div>

      <div className="kenali__grid">
        <article className="kenali__card kenali__card--channels">
          <h3 className="kenali__card-title">Semak di mana-mana</h3>
          <p className="kenali__card-text">WhatsApp AIFA, portal Sebenarnya.my dan media sosial rasmi kami.</p>
          <ul className="kenali__icons" aria-label="Saluran semakan">
            <li><Icon icon={MessageSquareText} size={20} /><span className="sr-only">WhatsApp AIFA</span></li>
            <li><Icon icon={Globe} size={20} /><span className="sr-only">Portal Sebenarnya.my</span></li>
            <li><Icon icon={Smartphone} size={20} /><span className="sr-only">Media sosial</span></li>
          </ul>
        </article>

        <figure className="kenali__card kenali__card--photo">
          <img
            src={withBase('/images/posts/sebenarnya-fc-phone-sharing.jpg')}
            alt="Dua orang menyemak mesej di telefon di kedai kopi"
            loading="lazy"
          />
          <figcaption className="kenali__pill">Tanya sebelum kongsi.</figcaption>
        </figure>

        <article className="kenali__card kenali__card--verdicts">
          <h3 className="kenali__card-title">Tiga jawapan yang jelas</h3>
          <ul className="kenali__verdicts">
            <li><Verdict type="palsu" /></li>
            <li><Verdict type="makluman" /></li>
            <li><Verdict type="penjelasan" /></li>
          </ul>
        </article>

        <figure className="kenali__card kenali__card--poster">
          {/* Square poster in a short card: shown whole (object-fit: contain) on white, trophy and lettering never cropped */}
          <img
            src={withBase('/images/bento/wsis-prize-award.webp')}
            alt="Poster Anugerah WSIS 2026 dengan trofi, World Summit on the Information Society, Geneva, Switzerland"
            loading="lazy"
          />
        </figure>

        <article className="kenali__card kenali__card--award">
          <p className="kenali__award-eyebrow">
            <Icon icon={Trophy} size={16} />
            Pengiktirafan tertinggi · WSIS PBB
          </p>
          <div className="kenali__award-body">
            <h3 className="kenali__award-title">Juara Dunia</h3>
            <p className="kenali__award-sub">dalam Kepercayaan Digital &amp; Semakan Fakta Awam</p>
            <p className="kenali__award-text">
              Apabila khabar angin tular tersebar pantas, fakta yang sahih mesti bergerak lebih pantas. Sebenarnya.my
              meraih penghormatan antarabangsa tertinggi di Anugerah WSIS PBB di Geneva — diiktiraf sebagai perisai utama
              Malaysia yang melindungi <strong>33 juta rakyat</strong> bersama <strong>lebih 20 agensi persekutuan</strong>.
            </p>
            <Button variant="media" href={withBase('/about-us/#berita-galeri')} iconEnd={ArrowRight} className="kenali__award-cta">
              Ketahui lebih lanjut
            </Button>
          </div>
        </article>

        <article className="kenali__card kenali__card--social">
          <h3 className="kenali__card-title">Ikuti kami di media sosial</h3>
          <p className="kenali__card-text">Tekan logo untuk menonton petikan hantaran terkini kami.</p>
          <SocialPeek className="kenali__social" />
        </article>
      </div>
    </section>
  );
}
