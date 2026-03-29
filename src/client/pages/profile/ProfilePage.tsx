//файл /ProfilePage.tsx
//файл расположен по адресу src/client/pages/profile/ProfilePage.tsx


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { Button } from '../../components/button/Button';
import ModalWrapper from '../../components/modal/ModalWrapper';
import styles from './ProfilePage.module.scss';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Данные профиля и общая статистика
  const { user, stats, loading: profileLoading, logout } = useProfile();
  
  // Логика удаления через наш новый хук
  const { deleteAccount, loading: isDeleting, error: deleteError, setError } = useDeleteAccount();

  // Состояния для управления двумя шагами модалок
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  // 1. Обработка загрузки
  if (profileLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loader}>Загрузка профиля...</div>
      </div>
    );
  }

  // 2. Обработка отсутствия пользователя
  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Упс! Данные не получены</h2>
          <p>Не удалось загрузить профиль. Возможно, сессия истекла.</p>
          <div className={styles.errorActions}>
            <Button onClick={() => window.location.reload()}>Повторить попытку</Button>
            <Button color="red" onClick={logout}>Вернуться на вход</Button>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = user.name ? user.name.charAt(0).toUpperCase() : '?';

  // Функция для финальной отправки запроса на удаление
  const handleFinalDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    
    const success = await deleteAccount(password, user.id);
    if (!success) {
      console.log('Ошибка при удалении: ', deleteError);
    }
  };

  return (
    <div className={styles.container}>
      {/* СЕКЦИЯ АВАТАРА */}
      <div className={styles.avatar}>
        {user.avatar_url ? (
          <img 
            src={user.avatar_url} 
            alt={user.name} 
            className={styles.profileImg}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).parentElement!.innerText = userInitial;
            }}
          />
        ) : (
          userInitial
        )}
      </div>
      
      {/* ИНФОРМАЦИЯ */}
      <div className={styles.info}>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
      
      {/* СТАТИСТИКА */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <label>Всего задач</label>
          <span>{stats.total}</span>
        </div>
        <div className={styles.statCard}>
          <label>Выполнено</label>
          <span className={styles.completedCount}>{stats.completed}</span>
        </div>
      </div>

      {/* КНОПКИ ДЕЙСТВИЙ */}
      <div className={styles.actions}>
          <Button onClick={() => navigate(`/edit/${user.id}`)}>
            Редактировать данные
          </Button>
          <Button color="red" onClick={() => setShowConfirmModal(true)}>
            Удалить профиль
          </Button>
      </div>

      {/* ШАГ 1: Модалка подтверждения (Вы уверены?) */}
      <ModalWrapper 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        title="Удаление аккаунта"
        size="sm"
      >
        <div className={styles.modalBody}>
          <p>Вы, <strong>{user.name}</strong>, уверены, что хотите полностью удалить свой профиль и все задачи?</p>
          <div className={styles.modalButtons}>
            <Button color="red" onClick={() => {
              setShowConfirmModal(false);
              setShowPasswordModal(true);
            }}>
              Да, я уверен
            </Button>
            <Button onClick={() => setShowConfirmModal(false)}>
              Нет, отмена
            </Button>
          </div>
        </div>
      </ModalWrapper>

      {/* ШАГ 2: Модалка ввода пароля */}
      <ModalWrapper 
        isOpen={showPasswordModal} 
        onClose={() => {
          setShowPasswordModal(false);
          setError(null);
          setPassword('');
        }}
        title="Подтвердите личность"
        size="sm"
      >
        <form onSubmit={handleFinalDelete} className={styles.modalBody}>
          <p>Введите ваш текущий пароль для завершения операции:</p>
          
          {deleteError && <div className={styles.errorMessage}>{deleteError}</div>}
          
          <input 
            type="password" 
            className={styles.modalInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ваш пароль"
            autoFocus
            required
          />
          
          <div className={styles.modalButtons}>
            <Button 
              type="submit"
              color="red" 
              disabled={isDeleting || !password}
            >
              {isDeleting ? 'Удаление...' : 'Подтверждаю'}
            </Button>
            <Button type="button" onClick={() => setShowPasswordModal(false)}>
              Отмена
            </Button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
};