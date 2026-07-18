import css from './LayoutRecipes.module.css';
type Props = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
};

const RecipesLayout = ({ children }: Props) => {
  return <section className={css.container}>{children}</section>;
};

export default RecipesLayout;
