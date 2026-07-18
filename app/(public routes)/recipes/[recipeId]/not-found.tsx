import Link from 'next/link';
import Image from 'next/image';
import css from './NotFound.module.css';

const RecipeNotFound = () => {
  return (
    <div className={css.container}>
      <Image
        src="/not-found.jpg"
        alt="Recipe not found"
        width={600}
        height={438}
        className={css.image}
      />
      <h1 className={css.code}>404</h1>
      <p className={css.message}>Recipe not found</p>
      <Link href="/" className={css.button}>
        <svg className={css.arrow}>
          <use href={'/icons/icons.svg#icon-back-to-home'} />
        </svg>
        Back to Home
      </Link>
    </div>
  );
};

export default RecipeNotFound;
