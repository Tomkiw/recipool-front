import Link from "next/link";
import css from "./Header.module.css";
import HeaderNav from "./HeaderNav";

const Header = () => {
  return (
    <header className={css.header}>
      <div className={css.inner}>
        <Link
          href="/"
          aria-label="Tasteorama — home"
          className={css.logoLink}
          prefetch={false}
        >
          <svg className={css.logo} aria-hidden="true">
            <use href="/icons/icons.svg#icon-logo" />
          </svg>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
};

export default Header;
