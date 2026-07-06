import css from './Loader.module.css';

type LoaderVariant = 'page' | 'section' | 'button';
type LoaderSize = 'small' | 'medium' | 'large';

interface LoaderProps {
  text?: string;
  variant?: LoaderVariant;
  size?: LoaderSize;
}

export default function Loader({
  variant = 'section',
  size = 'medium',
}: LoaderProps) {
  return (
    <div
      className={`${css.loaderWrapper} ${css[variant]}`}
      role="status"
      aria-live="polite"
    >
      <span className={`${css.loader} ${css[size]}`} />
      {variant !== 'button'}
    </div>
  );
}