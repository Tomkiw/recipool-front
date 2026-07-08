'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';
import css from './ProfileNavigation.module.css';

export default function ProfileNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={css.navContainer}>
      <Link
        href="/profile/own"
        className={`${css.link} ${isActive('/profile/own') ? css.activeLink : ''}`}
      >
        My Recipes
      </Link>
      <Link
        href="/profile/favorites"
        className={`${css.link} ${isActive('/profile/favorites') ? css.activeLink : ''}`}
      >
        Saved Recipes
      </Link>
    </nav>
  );
}
