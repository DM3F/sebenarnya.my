'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chip, ChipRow, SearchField } from '@/components/ui';
import { keywords, searchArticles } from '@/lib/searchArticles';

// Popular searches under the search bar; each one returns at least one fact-check
const POPULAR = ['Bantuan tunai', 'RON95', 'Hujan lebat', 'Lesen memandu'];

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  // Go to the articles page with the results, or show an error if nothing matches
  const handleSearch = (text) => {
    if (!keywords(text).length) {
      setError('Sila masukkan kata kunci untuk dicari, cth. "petrol", "hujan" atau "JPJ".');
      return;
    }
    if (!searchArticles(text).length) {
      setError(`Tiada semakan fakta dijumpai untuk “${text}”. Cuba kata kunci lain.`);
      return;
    }
    router.push(`/article?q=${encodeURIComponent(text)}`);
  };

  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content container">
          <div className="hero-heading">
            <h1 className="hero-title">
              {/* Three lines at one size on wide screens; on phones line 1 splits in two and lines 2–3 may wrap */}
              <span>
                <span className="hero-title__part">Hai, kami</span>{' '}
                <span className="hero-title__part">Sebenarnya.my</span>
              </span>{' '}
              <span className="hero-title__line">Semakan Berasaskan Fakta,</span>{' '}
              <span className="hero-title__line">Pengesahan Bersumberkan Maklumat Rasmi.</span>
            </h1>
          </div>

          <div className="hero-search-group">
            <SearchField
              className="hero-search"
              label="Cari dakwaan, topik atau kata kunci"
              hideLabel
              placeholder="Contoh: bantuan tunai WhatsApp"
              value={query}
              onChange={(text) => {
                setQuery(text);
                setError('');
              }}
              error={error}
              onSubmit={handleSearch}
            />
            <ChipRow label="Carian popular:" className="hero-popular">
              {POPULAR.map((term) => (
                <Chip
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    setError('');
                    handleSearch(term);
                  }}
                >
                  {term}
                </Chip>
              ))}
            </ChipRow>
          </div>
        </div>
      </div>
    </section>
  );
}
