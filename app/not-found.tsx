import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: 'Page not found | Tasteorama',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <Image
        src="/not-found.jpg"
        alt="Page not found"
        width={600}
        height={438}
        className={css.image}
        priority
      />
      <h1 className={css.code}>404</h1>
      <p className={css.message}>
        Sorry, we couldn&apos;t find the page you were looking for.
      </p>
      <Link href="/" className={css.button}>
        Back to Home
      </Link>
    </div>
  );
}
