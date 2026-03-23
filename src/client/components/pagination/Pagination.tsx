import React from 'react';
import styles from './Pagination.module.scss';
import { Button } from '../button/Button'; // Убедись, что путь до твоей кнопки верный

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Если страница всего одна, пагинацию не показываем
  if (totalPages <= 1) return null;

  return (
    <div className={styles.paginationWrapper}>
      <Button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        color={currentPage === 1 ? "gray" : "blue"}
      >
        Назад
      </Button>

      <div className={styles.pageInfo}>
        Страница <span>{currentPage}</span> из {totalPages}
      </div>

      <Button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        color={currentPage === totalPages ? "gray" : "blue"}
      >
        Вперед
      </Button>
    </div>
  );
};