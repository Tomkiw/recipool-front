'use client';

import { useEffect, useState } from 'react';
import css from './ScrollNav.module.css';

// Keeps an arrow hidden while there is almost nothing left to scroll that way.
const EDGE_OFFSET = 240;

const ScrollNav = () => {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      setCanScrollUp(scrolled > EDGE_OFFSET);
      setCanScrollDown(maxScroll - scrolled > EDGE_OFFSET);
    };

    update();

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // "Load more" grows the page, so the arrows have to react to that as well.
    const observer = new ResizeObserver(update);
    observer.observe(document.body);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (top: number) => {
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (!canScrollUp && !canScrollDown) {
    return null;
  }

  return (
    <div className={css.wrapper}>
      {canScrollUp && (
        <button
          type="button"
          className={css.btn}
          aria-label="Scroll to top"
          onClick={() => scrollTo(0)}
        >
          <svg className={`${css.icon} ${css.iconUp}`} aria-hidden="true">
            <use href="/icons/icons.svg#icon-chevron-down" />
          </svg>
        </button>
      )}

      {canScrollDown && (
        <button
          type="button"
          className={css.btn}
          aria-label="Scroll to bottom"
          onClick={() => scrollTo(document.documentElement.scrollHeight)}
        >
          <svg className={css.icon} aria-hidden="true">
            <use href="/icons/icons.svg#icon-chevron-down" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ScrollNav;
