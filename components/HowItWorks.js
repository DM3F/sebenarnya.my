import { ArrowRight, Globe, MessageSquareText, Smartphone, Trophy } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Verdict from '@/components/ui/Verdict';
import { Button } from '@/components/ui';
import { withBase } from '@/lib/basePath';
import SocialPeek from '@/components/SocialPeek';

// "Cara Sebenarnya.my membantu": a 3-column bento.
// Desktop areas: channels | WSIS poster (3 rows) | verdicts
//                story    | poster              | award "Juara Dunia" (2 rows)
//                social   | poster              | award

export default function HowItWorks() {
  return (
    <section className="how" aria-labelledby="how-title">
      <div className="how__head">
        <h2 className="how__title" id="how-title">Cara Sebenarnya.my membantu anda</h2>
        <p className="how__lead">Dari mesej tular ke jawapan rasmi, dalam beberapa langkah mudah.</p>
      </div>

      <div className="how__grid">
        <article className="how__card how__card--channels">
          <h3 className="how__card-title">Semak di mana-mana</h3>
          <p className="how__card-text">WhatsApp AIFA, portal Sebenarnya.my dan media sosial rasmi kami.</p>
          <ul className="how__icons" aria-label="Saluran semakan">
            <li><Icon icon={MessageSquareText} size={20} /><span className="sr-only">WhatsApp AIFA</span></li>
            <li><Icon icon={Globe} size={20} /><span className="sr-only">Portal Sebenarnya.my</span></li>
            <li><Icon icon={Smartphone} size={20} /><span className="sr-only">Media sosial</span></li>
          </ul>
        </article>

        <figure className="how__card how__card--poster how__card--main">
          {/* Square poster in a tall card: shown whole (object-fit: contain) on white, never cropped */}
          <img
            src={withBase('/images/bento/wsis-prize-award.webp')}
            alt="Poster Anugerah WSIS 2026 dengan trofi, World Summit on the Information Society, Geneva, Switzerland"
            loading="lazy"
          />
        </figure>

        <article className="how__card how__card--verdicts">
          <h3 className="how__card-title">Tiga jawapan yang jelas</h3>
          <ul className="how__verdicts">
            <li><Verdict type="palsu" /></li>
            <li><Verdict type="makluman" /></li>
            <li><Verdict type="penjelasan" /></li>
          </ul>
        </article>

        <figure className="how__card how__card--photo how__card--story">
          <img
            src={withBase('/images/posts/sebenarnya-fc-senior-dialogue.jpg')}
            alt="Warga emas berbincang bersama keluarga di ruang menunggu"
            loading="lazy"
          />
          <figcaption className="how__story">Satu semakan kecil, satu berita palsu berhenti di sini.</figcaption>
        </figure>

        <article className="how__card how__card--award">
          <p className="how__award-eyebrow">
            <Icon icon={Trophy} size={16} />
            Pengiktirafan tertinggi · WSIS PBB
          </p>
          <div className="how__award-body">
            <h3 className="how__award-title">Juara Dunia</h3>
            <p className="how__award-text">dalam Kepercayaan Digital &amp; Semakan Fakta Awam</p>
            <Button variant="media" href={withBase('/about-us/#berita-galeri')} iconEnd={ArrowRight} className="how__award-cta">
              Ketahui lebih lanjut
            </Button>
          </div>
        </article>

        <article className="how__card how__card--agencies">
          <h3 className="how__card-title">Ikuti kami di media sosial</h3>
          <p className="how__card-text">Tekan logo untuk menonton petikan hantaran terkini kami.</p>
          <SocialPeek className="how__social" />
        </article>
      </div>
    </section>
  );
}
