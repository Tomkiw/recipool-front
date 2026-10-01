'use client';

import { fetchRecipes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './Hero.module.css';
import { useFiltersStore } from '@/lib/store/filtersStore';
import style from '@/app/Home.module.css';
import { useRecipeFilters } from '@/hooks/useRecipeFilters';
import { useCategories } from '@/hooks/useCategories';
import {
  POPULAR_CATEGORIES,
  RECIPES_SECTION_ID,
} from '@/lib/constants/recipes';
import { pluralize } from '@/lib/utils/format';

interface HeroProps {
  // Загальна кількість з серверного запиту — не залежить від активних фільтрів.
  totalRecipes: number;
}

function Hero({ totalRecipes }: HeroProps) {
  const { applyFilters } = useRecipeFilters();
  const { data: categories = [] } = useCategories();
  const activeCategory = useFiltersStore((state) => state.filters.category);
  const filters = useFiltersStore((state) => state.filters);
  const filtersChange = useFiltersStore((state) => state.filtersChange);
  const setRecipesData = useFiltersStore((state) => state.setRecipesData);
  const setIsLoading = useFiltersStore((state) => state.setIsLoading);
  const isLoading = useFiltersStore((state) => state.isLoading);

  const handleSearch = async (value: string) => {
    filtersChange({ keyword: value });

    setIsLoading(true);

    const iziToast = (await import('izitoast')).default;

    try {
      const data = await fetchRecipes({
        keyword: value,
        category: filters.category,
        ingredient: filters.ingredient,
      });

      setRecipesData({
        recipes: data.recipes,
        totalRecipes: data.totalRecipes,
        totalPages: data.totalPages,
      });

      if (data.recipes.length === 0) {
        iziToast.warning({
          title: 'Not Found',
          message: 'No recipes found for your search query.',
          position: 'topRight',
        });
      }
    } catch {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong during search.',
        position: 'topRight',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopularClick = (category: string) => {
    // Повторний клік по активному чипу знімає фільтр.
    const nextCategory = activeCategory === category ? '' : category;
    void applyFilters({ category: nextCategory });
    document
      .getElementById(RECIPES_SECTION_ID)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={css.hero} aria-labelledby="hero-title">
      <div className={`${style.container} ${css.inner}`}>
        {totalRecipes > 0 && (
          <p className={css.eyebrow}>
            {pluralize(totalRecipes, 'recipe')}
            {categories.length > 0 &&
              ` · ${pluralize(categories.length, 'category', 'categories')}`}
          </p>
        )}
        <h1 id="hero-title" className={css.title}>
          Plan, Cook, and Share Your Flavors
        </h1>
        <p className={css.subtitle}>
          Discover, save, and share your favorite recipes.
        </p>
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />
        <div
          className={css.popular}
          role="group"
          aria-label="Popular categories"
        >
          <span className={css.popularLabel} aria-hidden="true">
            Popular:
          </span>
          {POPULAR_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={css.chip}
              aria-pressed={activeCategory === category}
              onClick={() => handlePopularClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
