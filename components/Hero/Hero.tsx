'use client';

import { fetchRecipes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './Hero.module.css';
import { useFiltersStore } from '@/lib/store/filtersStore';
import style from '@/app/Home.module.css';

function Hero() {
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
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong during search.',
        position: 'topRight',
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={css.hero}>
      <div className={style.container}>
        <h1 className={css.hero__title}>Plan, Cook, and Share Your Flavors</h1>
        <SearchBox onSearch={handleSearch} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default Hero;
