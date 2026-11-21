import Link from 'next/link';
import ShareButton from './ShareButton';
import { agencyParts, formatDate } from '@/lib/articles';
import { ArrowLeft } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { Verdict } from '@/components/ui';

/**
 * Article detail.
 * Back link, verdict pill, title, subtitle, meta + share,
 * 1100×550 image, then a 680px reading column: lead, divider, "Penjelasan rasmi".
 */
export default function ArticleDetail({ article }) {
  const { short, full } = agencyParts(article.agency.name);

  return (
    <article className="post-page">
      <header className="post-head">
        <Link className="post-back" href="/article">
          <Icon icon={ArrowLeft} />
          Semua artikel
        </Link>

        <div className="post-tags">
          <Verdict type={article.status} tone="single" />
        </div>

        <h1 className="post-title">{article.title}</h1>
        <p className="post-subtitle">Penjelasan rasmi daripada {full} ({short}).</p>

        <div className="post-meta">
          <span>
            Tular: <time dateTime={article.date}>{formatDate(article.date)}</time>
            <span aria-hidden="true"> · </span>
            Sumber: {short}
          </span>
          <ShareButton title={article.title} />
        </div>

        <img className="post-image" src={article.image} alt={article.alt} />
      </header>

      <div className="post-body">
        <p className="post-lead">{article.lead}</p>

        <section className="post-section">
          <h2>Penjelasan rasmi</h2>
          {article.explanation && <p>{article.explanation}</p>}
          <p>Sentiasa rujuk saluran rasmi {short} untuk perkembangan terkini.</p>
        </section>
      </div>
    </article>
  );
}
