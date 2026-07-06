"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./Footer.module.css";

const FooterAccountLink = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen === false) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  if (isAuthenticated) {
    return (
      <Link href="/profile" className={css.link} prefetch={false}>
        Account
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={css.link}
        onClick={() => setIsOpen(true)}
      >
        Account
      </button>
      {isOpen && (
        <div
          className={css.backdrop}
          role="dialog"
          aria-modal="true"
          aria-label="Sign in or register"
          onClick={() => setIsOpen(false)}
        >
          <div className={css.modal} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={css.modalClose}
              aria-label="Close"
              onClick={() => setIsOpen(false)}
            >
              <svg className={css.modalCloseIcon} aria-hidden="true">
                <use href="/icons/icons.svg#icon-close-modal" />
              </svg>
            </button>
            <p className={css.modalTitle}>
              Sign in or create an account to access your profile.
            </p>
            <div className={css.modalActions}>
              <Link
                href="/auth/login"
                className={css.modalAction}
                onClick={() => setIsOpen(false)}
                prefetch={false}
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className={css.modalActionPrimary}
                onClick={() => setIsOpen(false)}
                prefetch={false}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FooterAccountLink;
