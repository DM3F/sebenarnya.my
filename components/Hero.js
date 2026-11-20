'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchField } from '@/components/ui';
import { keywords, searchArticles } from '@/lib/searchArticles';

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
          <h1 className="hero-title">
            Hai, kami Sebenarnya.my.
            <br />
            <span className="hero-tagline">Semak dakwaan. Temukan kebenaran.</span>
          </h1>

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
        </div>
      </div>
    </section>
  );
}
