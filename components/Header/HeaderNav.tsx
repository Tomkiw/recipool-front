'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import css from './HeaderNav.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { logout } from '@/lib/api/clientApi';
import LogoutModal from '@/components/LogoutModal/LogoutModal';

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const panelId = useId();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearIsAuthenticated = useAuthStore((s) => s.clearIsAuthenticated);

  useEffect(() => {
    if (isOpen === false) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      setIsLogoutOpen(false);
      setIsOpen(false);
      router.push('/');
    }
  };

  const userName = user?.name || user?.email?.split('@')[0] || '';
  const avatarInitial = userName.charAt(0).toUpperCase() || 'U';

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const linkClass = (href: string) =>
    `${css.link} ${isActive(href) ? css.linkActive : ''}`;

  const ctaClass = (href: string) =>
    `${css.link} ${css.cta} ${isActive(href) ? css.linkActive : ''}`;

  const guestLinks = (
    <>
      <li className={css.item}>
        <Link href="/" className={linkClass('/')} prefetch={false}>
          Recipes
        </Link>
      </li>
      <li className={css.item}>
        <Link
          href="/auth/login"
          className={linkClass('/auth/login')}
          prefetch={false}
        >
          Log in
        </Link>
      </li>
      <li className={css.item}>
        <Link
          href="/auth/register"
          className={ctaClass('/auth/register')}
          prefetch={false}
        >
          Register
        </Link>
      </li>
    </>
  );

  const authLinks = (
    <>
      <li className={css.item}>
        <Link href="/" className={linkClass('/')} prefetch={false}>
          Recipes
        </Link>
      </li>
      <li className={css.item}>
        <Link
          href="/profile/own"
          className={linkClass('/profile')}
          prefetch={false}
        >
          My Profile
        </Link>
      </li>
      <li className={css.item}>
        <Link
          href="/add-recipe"
          className={ctaClass('/add-recipe')}
          prefetch={false}
        >
          Add Recipe
        </Link>
      </li>
      <li className={`${css.item} ${css.userItem}`}>
        <span className={css.user}>
          <span className={css.avatar} aria-hidden="true">
            {avatarInitial}
          </span>
          <span className={css.userName}>{userName}</span>
        </span>
        <span className={css.divider} aria-hidden="true" />
        <button
          type="button"
          onClick={() => setIsLogoutOpen(true)}
          className={css.iconButton}
          aria-label="Log out"
        >
          <svg className={css.icon24} aria-hidden="true">
            <use href="/icons/icons.svg#icon-logout" />
          </svg>
        </button>
      </li>
    </>
  );

  const links = isAuthenticated ? authLinks : guestLinks;

  return (
    <nav className={css.nav} aria-label="Main navigation">
      <button
        type="button"
        className={css.burger}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((v) => (v ? false : true))}
      >
        <svg className={css.icon32} aria-hidden="true">
          <use
            href={
              isOpen
                ? '/icons/icons.svg#icon-close-modal'
                : '/icons/icons.svg#icon-burger'
            }
          />
        </svg>
      </button>

      <ul className={css.desktopList}>{links}</ul>

      <div
        id={panelId}
        className={`${css.mobilePanel} ${isOpen ? css.mobilePanelOpen : ''}`}
      >
        {/* Any tap inside the panel — a link or the logout button — closes it. */}
        <ul className={css.mobileList} onClick={() => setIsOpen(false)}>
          {links}
        </ul>
      </div>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </nav>
  );
};

export default HeaderNav;
