import Link from "next/link";
import css from "./Header.module.css";
import HeaderNav from "./HeaderNav";
import Logo from "@/components/Logo/Logo";

const Header = () => {
  return (
    <header className={css.header}>
      <div className={css.inner}>
        <Link
          href="/"
          aria-label="Recipool — home"
          className={css.logoLink}
          prefetch={false}
        >
          <Logo className={css.logo} />
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
};

export default Header;
