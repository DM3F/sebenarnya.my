import Image from 'next/image';
import Link from 'next/link';
import { withBase } from '@/lib/basePath';

// Site logo; clicking it goes back to the main page.
// 180×54 keeps the file's 356×107 ratio, so CSS `height: auto` does not trigger a Next warning.
export default function Logo() {
  return (
    <Link href="/" className="logo-link" aria-label="Sebenarnya.my – Laman utama">
      <Image
        src={withBase('/images/logo/logo.png')}
        alt="Sebenarnya.my Logo"
        width={180}
        height={54}
        priority
      />
    </Link>
  );
}
