import { useEffect } from "react";
import css from "./LogoutModal.module.css";
import { createPortal } from "react-dom";


interface LogoutModalProps {
  isOpen: boolean;       
  onClose: () => void;    
  onConfirm: () => void;  
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className={css.overlay} onClick={handleBackdropClick}>
      <div className={css.modal}>
        
        <button onClick={onClose} className={css.closeButton} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.250001 0.25L7 7M7 7L0.25 13.75M7 7L13.75 13.75M7 7L13.75 0.250001" stroke="black" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
        </button>

        <h2 className={css.title}>Are you sure?</h2>
        <p className={css.description}>We will miss you!</p>

        <div className={css.buttonGroup}>
          <button onClick={onClose} className={css.cancelButton}>
            Cancel
          </button>
          
          <button onClick={onConfirm} className={css.logoutButton}>
            Log out
          </button>
        </div>
        
      </div>
    </div>,
    document.body
  );
}
