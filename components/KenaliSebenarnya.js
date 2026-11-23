import { Globe, MessageSquareText, Smartphone, Trophy } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import CountUp from '@/components/CountUp';
import { withBase } from '@/lib/basePath';
import SocialPeek from '@/components/SocialPeek';

// "Kenali Sebenarnya.my": a 3-column bento about the service.
// Desktop areas: channels | photo (3 rows) | visitors
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
            <li><Icon icon={MessageSquareText} size="lg" /><span className="sr-only">WhatsApp AIFA</span></li>
            <li><Icon icon={Globe} size="lg" /><span className="sr-only">Portal Sebenarnya.my</span></li>
            <li><Icon icon={Smartphone} size="lg" /><span className="sr-only">Media sosial</span></li>
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

        <article className="kenali__card kenali__card--visitors">
          <h3 className="kenali__card-title kenali__visitors-title">
            Lebih <CountUp value={130} /> pengunjung setiap hari
          </h3>
          <div className="kenali__visitors-foot">
            <ul className="kenali__avatars" aria-hidden="true">
              {[1, 2, 3, 4].map((n) => (
                <li key={n}>
                  <img src={withBase(`/images/avatars/visitor-${n}.webp`)} alt="" width="40" height="40" loading="lazy" />
                </li>
              ))}
            </ul>
            <p className="kenali__visitors-text">menyemak fakta bersama kami</p>
          </div>
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
            <Icon icon={Trophy} />
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
          </div>
        </article>

        <article className="kenali__card kenali__card--social">
          <h3 className="kenali__card-title">Ikuti kami di media sosial</h3>
          <p className="kenali__card-text">Klik logo untuk melihat perkongsian terkini kami.</p>
          <SocialPeek className="kenali__social" />
        </article>
      </div>
    </section>
  );
}
