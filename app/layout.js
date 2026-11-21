import './tokens.css';
import './global.css';
import './ui.css';
import { Manrope } from 'next/font/google';
import Chatbot from '@/components/Chatbot';
import PageTransition from '@/components/PageTransition';
import ClaimForm from '@/components/ClaimForm';
import { withBase } from '@/lib/basePath';

// Manrope (variable font, 200–800) is the only family: content, headings and UI controls.
// tokens.css reads it through var(--font-manrope).
const manrope = Manrope({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-manrope',
});


const description =
  'Sebenarnya.my membantu orang ramai mendapatkan maklumat sahih dan maklum balas rasmi, mengikuti berita dan perkembangan terkini, menyemak dakwaan serta menyalurkan maklumat yang diragui.';

export const metadata = {
  title: 'Sebenarnya.my',
  description,
  icons: { icon: withBase('/images/logo/icon.png') },
  openGraph: {
    type: 'website',
    siteName: 'Sebenarnya.my',
    title: 'Sebenarnya.my',
    description,
  },
  twitter: {
    card: 'summary',
    title: 'Sebenarnya.my',
    description,
  },
  // Carried over from the old site: keeps search engines out. Remove when the site goes live.
  robots: { index: false, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ms" className={`${manrope.variable}`}>
      <body>
        {/* First focusable element: jump past the header (WCAG 2.4.1) */}
        <a href="#main" className="ui-btn ui-btn--filled ui-skip-link">
          Langkau ke kandungan
        </a>
        {children}
        {/* Page transition between routes (animation in global.css) */}
        <PageTransition />
        {/* AIFA chatbot: floating on every page */}
        <Chatbot />
        {/* Submit-claim form: opens as a pop-up from any /submit-claim/ link */}
        <ClaimForm />
      </body>
    </html>
  );
}
