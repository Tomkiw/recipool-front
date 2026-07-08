'use client';

import { fetchRecipeById } from '@/lib/api/clientApi';
import css from './RecipeDetails.module.css';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import SaveButton from '@/components/SaveButton/SaveButton';
import Loader from '@/components/Loader/Loader';

const RecipeDetailsClient = () => {
  const { recipeId } = useParams<{ recipeId: string }>();

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => fetchRecipeById(recipeId),
    refetchOnMount: false,
  });

  if (isLoading) return <Loader
                  variant="section"
                  size="large"
                />;
  if (error || !recipe) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className={css.info}>
          <h1 className={css.title}>{recipe.title}</h1>
        </div>
        <div className={css.imageWrapper}>
          <Image
            src={recipe.thumb || recipe.image || '/not-found.jpg'}
            fill
            // sizes="(max-width: 768px) 100vw, 600px"
            alt={recipe.title}
            className={css.image}
          />
        </div>
      </div>

      <div className={css.content}>
        <aside className={css.sidebar}>
          <div className={css.infoBox}>
            <h3 className={css.infoBoxTitle}>General informations</h3>
            <div className={css.infoItem}>
              <span className={css.infoLabel}>Category:</span>
              <span className={css.infoValue}>{recipe.category.name}</span>
            </div>
            <div className={css.infoItem}>
              <span className={css.infoLabel}>Cooking time:</span>
              <span className={css.infoValue}>{recipe.time} minutes</span>
            </div>
            <div className={css.infoItem}>
              <span className={css.infoLabel}>Calorie content:</span>
              <span className={css.infoValue}>
                Approx. {recipe.calories || '~'} kcal per serving
              </span>
            </div>
          </div>
          <SaveButton recipeId={recipeId} />
        </aside>

        <div className={css.mainContent}>
          <section className={css.section}>
            <h2 className={css.sectionTitle}>About recipe</h2>
            <p className={css.description}>{recipe.description}</p>
          </section>

          <section className={css.section}>
            <h2 className={css.sectionTitle}>Ingredients:</h2>
            <ul className={css.ingredientsList}>
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className={css.ingredientItem}>
                  {ingredient.id.name} — {ingredient.measure}
                </li>
              ))}
            </ul>
          </section>

          <section className={css.section}>
            <h2 className={css.sectionTitle}>Preparation Steps:</h2>
            <p className={css.instructions}>{recipe.instructions}</p>
          </section>
        </div>

        <aside className={css.sidebar}>
          <div className={css.infoBox}>
            <h3 className={css.infoBoxTitle}>General informations</h3>
            <div className={css.infoItem}>
              <span className={css.infoLabel}>Category:</span>
              <span className={css.infoValue}>{recipe.category?.name}</span>
            </div>
            <div className={css.infoItem}>
              <span className={css.infoLabel}>Cooking time:</span>
              <span className={css.infoValue}>{recipe.time} minutes</span>
            </div>
            <div className={css.infoItem}>
              <span className={css.infoLabel}>Calorie content:</span>
              <span className={css.infoValue}>
                Approx. {recipe.calories || `~`} kcal per serving
              </span>
            </div>
          </div>
          <SaveButton recipeId={recipeId} />
        </aside>
      </div>
    </div>
  );
};

export default RecipeDetailsClient;
