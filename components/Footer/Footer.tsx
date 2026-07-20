import Link from "next/link";
import css from "./Footer.module.css";
import FooterAccountLink from "./FooterAccountLink";
import Logo from "@/components/Logo/Logo";

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.inner}>
        <Link
          href="/"
          aria-label="Recipool — home"
          className={css.logoLink}
          prefetch={false}
        >
          <Logo className={css.logo} />
        </Link>

        <p className={css.copyright}>
          © 2025 Recipool. All rights reserved.
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
