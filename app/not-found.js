import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge, Button } from '@/components/ui';
import { withBase } from '@/lib/basePath';

export const metadata = {
  title: 'Halaman tidak dijumpai | Sebenarnya.my',
};

export default function NotFound() {
  return (
    <div className="site">
      <Header />

      <main className="main main--roomy" id="main" tabIndex={-1}>
        <section className="page-notice" aria-labelledby="not-found-title">
          <Badge variant="eyebrow" className="page-notice__eyebrow">Ralat 404</Badge>
          <h1 className="post-title" id="not-found-title">Halaman ini tidak dijumpai</h1>
          <p className="post-subtitle">
            Pautan mungkin sudah lama atau tersalah taip. Cuba semak dakwaan dari halaman utama atau lihat semua artikel.
          </p>
          <div className="page-notice__actions">
            <Button href={withBase('/')}>Ke halaman utama</Button>
            <Button href={withBase('/article/')} variant="outline">Lihat semua artikel</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
