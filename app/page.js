import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Carousel from '@/components/Carousel';
import Stories from '@/components/Stories';
import Bento from '@/components/Bento';
import Latest from '@/components/Latest';
import Footer from '@/components/Footer';
import Viewership from '@/components/Viewership';
import HowItWorks from '@/components/HowItWorks';
import Collaborators from '@/components/Collaborators';
import ScrollMotion from '@/components/ScrollMotion';

export default function HomePage() {
  return (
    <div className="site">
      {/* Header */}
      <Header />

      <main className="main" id="main" tabIndex={-1}>
        {/* Hero + latest fact-checks slider */}
        <Hero />

        {/* Carousel */}
        <Carousel />

        {/* Agency logos: official statements come from these sources */}
        <Collaborators />

        {/* Latest fact-checks */}
        <Latest />

        {/* Tentang ringkas: statement and stats */}
        <Viewership />

        {/* Cara Sebenarnya.my membantu: channels, verdicts, AIFA 24 jam, agencies */}
        <HowItWorks />

        {/* Aktiviti media sosial terkini: WSIS banner + social posts */}
        <section className="activity" aria-labelledby="activity-title">
          <h2 className="activity__title" id="activity-title">Aktiviti media sosial terkini</h2>
          <div className="activity__grid">
            <Bento />
            <Stories />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      <ScrollMotion />
    </div>
  );
}
