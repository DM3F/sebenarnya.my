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
            <p className="viewership-lead" id="viewership-lead">
              Sebenarnya.my membantu rakyat Malaysia menyemak berita tular sebelum dikongsi. Setiap semakan merujuk
              kenyataan rasmi agensi kerajaan, supaya maklumat yang sampai kepada anda tepat, jelas dan boleh dipercayai.
            </p>
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
