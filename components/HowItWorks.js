import { Globe, MessageSquareText, ShieldCheck, Smartphone, Clock } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Verdict from '@/components/ui/Verdict';
import { withBase } from '@/lib/basePath';

// "Cara Sebenarnya.my membantu": a 3-column bento.
// Desktop areas: channels | photo (3 rows) | verdicts
//                story    | photo         | stat (2 rows)
//                agencies | photo         | stat
const AGENCIES = [
  { file: 'agency-mcmc.webp', name: 'MCMC' },
  { file: 'agency-kkm.webp', name: 'KKM' },
  { file: 'agency-pdrm.webp', name: 'PDRM' },
  { file: 'agency-jpj.webp', name: 'JPJ' },
  { file: 'agency-met.webp', name: 'METMalaysia' },
];

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

        <figure className="how__card how__card--photo how__card--main">
          <img
            src={withBase('/images/posts/sebenarnya-fc-phone-sharing.jpg')}
            alt="Dua orang menyemak mesej di telefon di kedai kopi"
            loading="lazy"
          />
          <figcaption className="how__pill">Tanya sebelum kongsi.</figcaption>
        </figure>

        <article className="how__card how__card--verdicts">
          <h3 className="how__card-title">Empat jawapan yang jelas</h3>
          <ul className="how__verdicts">
            <li><Verdict type="palsu" /></li>
            <li><Verdict type="waspada" /></li>
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

        <article className="how__card how__card--stat">
          <Icon icon={Clock} size={32} className="how__stat-icon" />
          <div>
            <p className="how__stat-number">
              24<span> jam</span>
            </p>
            <p className="how__stat-text">AIFA menjawab di WhatsApp <span className="how__nowrap">03-8688 7997</span>, setiap hari.</p>
          </div>
        </article>

        <article className="how__card how__card--agencies">
          <h3 className="how__card-title">
            <Icon icon={ShieldCheck} size={20} className="how__title-icon" />
            Disahkan agensi rasmi
          </h3>
          <p className="how__card-text">Setiap jawapan merujuk kenyataan agensi yang berkaitan.</p>
          <ul className="how__avatars" aria-label="Contoh agensi">
            {AGENCIES.map((a) => (
              <li key={a.file}>
                <img src={withBase(`/images/authors/${a.file}`)} alt={a.name} width="44" height="44" loading="lazy" />
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
