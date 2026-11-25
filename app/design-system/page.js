import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DesignSystemGuide from '@/components/DesignSystemGuide';
import { readTokens } from '@/lib/designTokens';
import './design-system.css';

export const metadata = {
  title: 'Design system | Sebenarnya.my',
  description: 'Rujukan visual design system Sebenarnya.my: token, tipografi dan komponen, dirender daripada kod sebenar.',
  // Internal reference page: never in search results, not linked from the nav
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  // Read at build time, so the page always lists exactly what app/tokens.css defines
  const tokens = readTokens();

  return (
    <div className="site">
      <Header />

      <main className="main dsg" id="main" tabIndex={-1}>
        <DesignSystemGuide tokens={tokens} />
      </main>

      <Footer />
    </div>
  );
}
