import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui';
import { CLAIM_HREF } from '@/components/ClaimForm';
import { withBase } from '@/lib/basePath';

export const metadata = {
  title: 'Lapor berita tular | Sebenarnya.my',
  description: 'Hantar berita tular yang anda ragui untuk disemak oleh agensi rasmi.',
};

// Direct visits (shared link, new tab, no JS yet) land here instead of a 404.
// ClaimForm opens itself on this URL; the buttons reopen it or go back.
export default function SubmitClaimPage() {
  return (
    <div className="site">
      <Header />

      <main className="main" id="main" tabIndex={-1}>
        <section className="page-notice" aria-labelledby="claim-page-title">
          <h1 className="post-title" id="claim-page-title">Lapor berita tular</h1>
          <p className="post-subtitle">
            Terima mesej yang anda ragui? Hantar kepada kami dan agensi rasmi yang berkaitan akan menyemaknya.
          </p>
          <div className="page-notice__actions">
            <Button href={withBase(CLAIM_HREF)}>Buka borang laporan</Button>
            <Button href={withBase('/article/')} variant="outline">Lihat semakan fakta</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
