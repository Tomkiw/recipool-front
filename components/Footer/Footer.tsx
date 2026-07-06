import Link from "next/link";
import css from "./Footer.module.css";
import FooterAccountLink from "./FooterAccountLink";

const Footer = () => {
  return (
    <footer className={css.footer}>
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

        <p className={css.copyright}>
          © 2025 CookingCompanion. All rights reserved.
        </p>

        <nav aria-label="Footer navigation">
          <ul className={css.links}>
            <li className={css.item}>
              <Link href="/" className={css.link} prefetch={false}>
                Recipes
              </Link>
            </li>
            <li className={css.item}>
              <FooterAccountLink />
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
