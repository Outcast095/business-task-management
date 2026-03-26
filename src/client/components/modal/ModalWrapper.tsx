// это файл ModalWrapper.tsx
// расположен по адресу src/client/components/modal/ModalWrapper.tsx

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './ModalWrapper.module.scss';
import clsx from 'clsx'; // если используешь библиотеку для классов, иначе просто строки

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'auto';
  disableOutsideClick?: boolean;
}

const ModalWrapper: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  disableOutsideClick = false,
}) => {
  // Закрытие по Escape
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (!disableOutsideClick) onClose();
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div 
        className={clsx(styles.modal, styles[size])} 
        onClick={(e) => e.stopPropagation()} // Чтобы клик внутри модалки не закрывал её
      >
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') as HTMLElement
  );
};

export default ModalWrapper;