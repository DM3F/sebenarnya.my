import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import Latest from '@/components/Latest';
import Footer from '@/components/Footer';
import Viewership from '@/components/Viewership';
import KenaliSebenarnya from '@/components/KenaliSebenarnya';
import Collaborators from '@/components/Collaborators';
import PageEnter from '@/components/PageEnter';

export default function HomePage() {
  return (
    <div className="site">
      {/* Header */}
      <Header />

      <main className="main main--roomy" id="main" tabIndex={-1}>
        {/* Hero + latest fact-checks slider */}
        <Hero />

        {/* Carousel */}
        <Carousel />

        {/* Agency logos: official statements come from these sources */}
        <Collaborators />

        {/* Latest fact-checks */}
        <Latest />

        {/* Kenali Sebenarnya.my: channels, verdicts, WSIS award, social previews */}
        <KenaliSebenarnya />

        {/* Tentang ringkas: statement and stats — last, just before the footer */}
        <Viewership />

      </main>

      {/* Footer */}
      <Footer />

      <PageEnter />
    </div>
  );
}
