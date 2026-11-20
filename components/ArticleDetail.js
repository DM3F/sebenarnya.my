import Link from 'next/link';
import ShareButton from './ShareButton';
import { articleStatus } from '@/data/content';
import { agencyParts, articleActions, formatDate, getCategoryLabel } from '@/lib/articles';
import { ArrowLeft } from 'lucide-react';
import Icon from '@/components/ui/Icon';

// Full article page: tags, title, meta + share, image, body
export default function ArticleDetail({ article }) {
  const status = articleStatus[article.status];
  const { short, full } = agencyParts(article.agency.name);
  const actions = articleActions(article);

  return (
    <article className="post-page">
      <header className="post-head container">
        <Link className="post-back" href="/article">
          <Icon icon={ArrowLeft} />
          Semua artikel
        </Link>

        <div className="post-tags">
          <span className="post-status" style={{ '--status': status.color }}>
            <i />
            {status.label}
          </span>
          {article.categories.map((id) => (
            <span key={id} className="post-category">{getCategoryLabel(id)}</span>
          ))}
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
      </header>

      <div className="post-image container">
        <img src={article.image} alt={article.alt} />
      </div>

      <div className="post-body">
        <p className="post-lead">{article.lead}</p>

        <section>
          <h2>Penjelasan Rasmi</h2>
          <p>{article.explanation}</p>
          <p>Sentiasa rujuk saluran rasmi {short} untuk perkembangan terkini.</p>
        </section>

        <section>
          <h2>Apa Yang Perlu Anda Buat</h2>
          <ul>
            {actions.map((a) => (
              <li key={a.title}>
                <b>{a.title}:</b> {a.text}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
