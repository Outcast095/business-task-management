// src/client/pages/edit/EditPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEdit } from '../../hooks/useEdit';
import { Button } from '../../components/button/Button';
import styles from './EditPage.module.scss';

export const EditPage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    name: savedUser.name || '',
    email: savedUser.email || '',
    password: '',
    avatar_url: savedUser.avatar_url || ''
  });

  const { updateUserInfo, loading, status } = useEdit(userId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserInfo(formData);
  };

  return (
    <div className={styles.container}>
      <form className={styles.editForm} onSubmit={handleSubmit}>
        <h1>Редактирование профиля</h1>
        
        <div className={styles.field}>
          <label>Имя</label>
          <input 
            value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className={styles.field}>
          <label>URL Аватара</label>
          <input 
            value={formData.avatar_url} 
            onChange={e => setFormData({...formData, avatar_url: e.target.value})}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className={styles.field}>
          <label>Новый пароль (оставьте пустым, если не хотите менять)</label>
          <input 
            type="password"
            value={formData.password} 
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
          <Button type="button" color="red" onClick={() => navigate('/profile')}>
            Отмена
          </Button>
        </div>

        {status === 'success' && <p className={styles.success}>Данные успешно обновлены!</p>}
        {status === 'error' && <p className={styles.error}>Произошла ошибка при сохранении.</p>}
      </form>
    </div>
  );
};