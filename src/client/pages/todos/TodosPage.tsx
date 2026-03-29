// файл /TodosPage.tsx
// файл расположен по адресу src/client/pages/todosPage/TodosPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';

import { Form } from '../../components/form/Form';
import { Task } from '../../components/task/Task';

import { Pagination } from '../../components/pagination/Pagination';
import { SkeletonList } from '../../components/skeleton/Skeleton';
import { EmptyState } from '../../components/emptyState/EmptyState';

import styles from './TodosPage.module.scss'; // Импорт стилей

export const TodosPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const { 
    tasks, loading, addTask, deleteTask, toggleTask, 
    page, totalPages, setPage 
  } = useTasks(userId);

  const totalOnPage = tasks.length;
  const completedOnPage = tasks.filter(t => t.completed).length;

  return (
    <div className={styles.container}>
      <Form onAdd={addTask} />

      <div className={styles.listWrapper}>
        {loading ? (
          <SkeletonList count={6} />
        ) : tasks.length > 0 ? (
          tasks.map(task => (
            <Task 
              key={task.id}
              title={task.title}
              completed={task.completed}
              onToggle={() => toggleTask(task.id, task.completed)}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
};