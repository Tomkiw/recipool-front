'use client'
import css from '@/components/RecipesList/RecipesList.module.css'
import { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard/RecipeCard"; 
import LoadMoreBtn from '@/components/LoadMoreBtn/LoadMoreBtn';
import { fetchRecipes } from '@/lib/api/clientApi';
import { Recipe } from '@/types/recipe';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// ДОДАЙ ІМПОРТ СВОГО СТОРУ (шлях може відрізнятися, перевір його)
import { useFiltersStore } from '@/lib/store/filtersStore'; 

interface RecipeListProps {
  initialRecipes: Recipe[];
  totalPages: number;
  totalRecipes: number;
  searchQuery?: string;     
  currentCategory?: string; 
}

export default function RecipesList({
  initialRecipes,
  totalPages: initialTotalPages,
  totalRecipes: initialTotalRecipes,
  searchQuery = "",
  currentCategory = "",
}: RecipeListProps) {
  // 1. ДІСТАЄМО СТАН ТА ЕКШЕНИ З ZUSTAND
  const { 
    recipes, 
    totalRecipes, 
    totalPages, 
    setRecipesData, 
    filters,
    isLoading,
    setIsLoading,
    page,
    setPage 
  } = useFiltersStore();


  // 2. ГІДРАТАЦІЯ: Записуємо серверні дані в Zustand при першому завантаженні сторінки
  useEffect(() => {
    setRecipesData({
      recipes: initialRecipes,
      totalRecipes: initialTotalRecipes,
      totalPages: initialTotalPages,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRecipes, initialTotalRecipes, initialTotalPages]);

 
  // Щоб уникнути блимання порожнього екрану до спрацьовування useEffect,
  // використовуємо initialRecipes, якщо в сторі ще нічого немає.
  const displayRecipes = recipes.length > 0 ? recipes : initialRecipes;
  const displayTotal = totalRecipes > 0 || recipes.length > 0 ? totalRecipes : initialTotalRecipes;
  const displayTotalPages = totalPages > 0 || recipes.length > 0 ? totalPages : initialTotalPages;

  const hasMore = page < displayTotalPages;

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return; 

    setIsLoading(true);
    try {
      const nextPage = page + 1;
      
      // Запит робимо вже з урахуванням активних фільтрів зі стору
      const data = await fetchRecipes({
        page: nextPage,
        keyword: filters.keyword || searchQuery,
        category: filters.category || currentCategory,
      });
      
      // 3. ДОДАЄМО нові рецепти до ТИХ, ЩО ВЖЕ Є В СТОРІ
      setRecipesData({
        recipes: [...displayRecipes, ...data.recipes],
        totalRecipes: data.totalRecipes,
        totalPages: data.totalPages,
      });
      
      setPage(nextPage);
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "Failed to load more recipes. Please try again later.",
        position: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
        <h1 className={css.title}>Recipes</h1>
        <div className={css.meta}>
          <span className={css.count}>{displayTotal} recipes</span>
          <button className={css.filterBtn} aria-label="Filters">
            Filters
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>

      <ul className={css.grid}>
        {/* Використовуємо displayRecipes для рендеру */}
        {displayRecipes.map((recipe) => (
        <li key={recipe._id} className={css.gridItem}>
              <RecipeCard recipe={recipe} />
          </li>
        ))}
      </ul>

      {hasMore && (
          <LoadMoreBtn onClick={handleLoadMore} disabled={isLoading} />
      )}
    </>
  );
}