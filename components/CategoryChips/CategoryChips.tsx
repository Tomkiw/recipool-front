'use client';

import { useRef } from 'react';
import type { Category } from '@/types/category';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import css from './CategoryChips.module.css';

interface CategoryChipsProps {
  categories: Category[];
  // Порожній рядок = «All», як і в сторі фільтрів.
  value: string;
  onChange: (category: string) => void;
  // scroll — один рядок з горизонтальним скролом (панель), wrap — перенос (шторка).
  layout?: 'scroll' | 'wrap';
}

export default function CategoryChips({
  categories,
  value,
  onChange,
  layout = 'scroll',
}: CategoryChipsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight, scrollByPage } =
    useHorizontalScroll(listRef);

  const isScrollable = layout === 'scroll';
  const rootClassName = [
    css.root,
    isScrollable ? css.scroll : css.wrap,
    isScrollable && canScrollLeft ? css.fadeLeft : '',
    isScrollable && canScrollRight ? css.fadeRight : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClassName}>
      {isScrollable && canScrollLeft && (
        <button
          type="button"
          className={`${css.arrow} ${css.arrowLeft}`}
          aria-label="Scroll categories left"
          onClick={() => scrollByPage(-1)}
        >
          <svg
            className={css.arrowIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}

      <div ref={listRef} className={css.list}>
        <div className={css.track} role="group" aria-label="Categories">
          <button
            type="button"
            className={css.chip}
            aria-pressed={value === ''}
            onClick={() => onChange('')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              type="button"
              className={css.chip}
              aria-pressed={value === category.name}
              onClick={() => onChange(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {isScrollable && canScrollRight && (
        <button
          type="button"
          className={`${css.arrow} ${css.arrowRight}`}
          aria-label="Scroll categories right"
          onClick={() => scrollByPage(1)}
        >
          <svg
            className={css.arrowIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
}
