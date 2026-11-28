'use client';

import { Button } from '@/components/ui';
import { viewershipStats as stats } from '@/data/content';
import { withBase } from '@/lib/basePath';
import CountUp from '@/components/CountUp';

export default function Viewership() {
  return (
    <section className="viewership container" aria-labelledby="viewership-lead">
      <div className="viewership-inner">
        <div className="viewership-side">
          <div className="viewership-intro">
            <p className="viewership-kicker">
              Pusat semakan fakta
              <br />
              MCMC sejak 2017
            </p>
            <div className="viewership-why">
              <h2 className="viewership-why__title" id="viewership-lead">Mengapa Sebenarnya.my Pilihan Rakyat Malaysia?</h2>
              <p className="viewership-lead">
                Menjadi platform semakan fakta yang dipercayai dan menjadi rujukan utama masyarakat Malaysia dalam
                mendapatkan maklumat yang sahih dan tepat.
              </p>
            </div>
          </div>
          <Button href={withBase('/about-us/')}>Ketahui tentang kami</Button>
        </div>

        <dl className="viewership-stats">
          {stats.map((s, i) => (
            <div
              key={s.text}
              className={s.image ? 'viewership-stat viewership-stat--image' : 'viewership-stat'}
              style={s.image ? { backgroundImage: `url(${withBase(s.image)})` } : undefined}
            >
              <dt>
                <CountUp value={s.value} sep={s.sep} />
                {s.suffix}
                {s.unit && <small> {s.unit}</small>}
              </dt>
              <dd>{s.text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
