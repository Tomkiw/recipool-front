import { RefObject, useCallback, useEffect, useState } from 'react';

// scrollLeft на HiDPI-екранах буває дробовим — без допуску стрілка «вправо»
// не зникала б у самому кінці списку.
const SCROLL_EDGE_TOLERANCE = 2;
const SCROLL_PAGE_RATIO = 0.8;

export function useHorizontalScroll(ref: RefObject<HTMLElement | null>) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateEdges = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const maxScrollLeft = element.scrollWidth - element.clientWidth;
    setCanScrollLeft(element.scrollLeft > SCROLL_EDGE_TOLERANCE);
    setCanScrollRight(element.scrollLeft < maxScrollLeft - SCROLL_EDGE_TOLERANCE);
  }, [ref]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // ResizeObserver викликає колбек одразу після observe(), тож початковий
    // стан рахується без синхронного setState в ефекті. Спостерігаємо і за
    // першою дитиною: коли категорії довантажуються, ширина вмісту росте.
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);

    element.addEventListener('scroll', updateEdges, { passive: true });

    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', updateEdges);
    };
  }, [ref, updateEdges]);

  const scrollByPage = (direction: 1 | -1) => {
    const element = ref.current;
    if (!element) return;

    element.scrollBy({
      left: direction * element.clientWidth * SCROLL_PAGE_RATIO,
      behavior: 'smooth',
    });
  };

  return { canScrollLeft, canScrollRight, scrollByPage };
}
