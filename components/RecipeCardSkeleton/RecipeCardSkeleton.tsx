import css from './RecipeCardSkeleton.module.css';

// Та сама геометрія, що й у RecipeCard, щоб сітка не «стрибала» після завантаження.
export default function RecipeCardSkeleton() {
  return (
    <div className={css.card} aria-hidden="true">
      <div className={`${css.block} ${css.media}`} />
      <div className={css.content}>
        <div className={`${css.block} ${css.lineShort}`} />
        <div className={`${css.block} ${css.lineTitle}`} />
        <div className={`${css.block} ${css.line}`} />
        <div className={`${css.block} ${css.lineMedium}`} />
        <div className={`${css.block} ${css.lineLink}`} />
      </div>
    </div>
  );
}
