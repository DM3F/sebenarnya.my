import Header from '@/components/Header';
import AboutUs from '@/components/AboutUs';
import Footer from '@/components/Footer';
import PageEnter from '@/components/PageEnter';

export const metadata = {
  title: 'Tentang Kami | Sebenarnya.my',
};

export default function AboutPage() {
  return (
    <div className="site">
      <Header />

      <main className="main" id="main" tabIndex={-1}>
        {/* Hero, Who We Are, What We Do, How It Works */}
        <AboutUs />
      </main>

      <Footer />

      <PageEnter />
    </div>
  );
}
