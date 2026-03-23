import React from 'react';
import styles from './Skeleton.module.scss';

export const TaskSkeleton: React.FC = () => (
  <div className={styles.skeletonWrapper}>
    <div className={styles.square} />
    <div className={styles.line} />
  </div>
);

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <TaskSkeleton key={i} />
      ))}
    </>
  );
};