'use client';

import { useEffect, useState } from 'react';
import css from './ScrollToTopButton.module.css';

const SCROLL_THRESHOLD = 150;

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const preventFocusScroll = (
    event: React.PointerEvent<HTMLButtonElement>
  ) => {
    // На дотик/клік браузер намагається "проскролити" фіксовану кнопку
    // у вʼю ще до onClick — звідси різкий стрибок сторінки на мобільних.
    // Забороняємо фокус при вказівникових подіях, залишаючи його для Tab.
    event.preventDefault();
  };

  const scrollToTop = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`${css.button} ${isVisible ? css.visible : ''}`}
      onPointerDown={preventFocusScroll}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
    >
      <svg className={css.icon} aria-hidden="true">
        <use href="/icons/icons.svg#icon-chevron-down" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
