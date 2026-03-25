// это файл DragDrop.tsx
// расположен по адресу src/client/components/dragDrop/DragDrop.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DragDrop.module.scss';

interface DragDropProps {
  onFileSelect: (file: File) => void;
  initialPreview?: string;
}

export const DragDrop: React.FC<DragDropProps> = ({ onFileSelect, initialPreview }) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);

  // Обновляем превью, если initialPreview изменился (например, данные из БД подтянулись позже)
  useEffect(() => {
    if (initialPreview) setPreview(initialPreview);
  }, [initialPreview]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // 1. Создаем локальную ссылку для отображения картинки
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // 2. Передаем сам файл «наверх» в родительский компонент (EditPage)
      onFileSelect(file);

      // Чистим память при размонтировании
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: false,
    maxSize: 5242880 // 5MB
  });

  return (
    <div 
      {...getRootProps()} 
      className={`
        ${styles.dropZone} 
        ${isDragActive ? styles.active : ''} 
        ${isDragReject ? styles.reject : ''}
      `}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className={styles.previewWrapper}>
          <img src={preview} alt="Avatar" className={styles.avatarImage} />
          <div className={styles.overlay}>
            <span>Заменить фото</span>
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.icon}>📸</div>
          <p>{isDragActive ? "Бросайте сюда" : "Перетащите фото или кликните"}</p>
          <small>PNG, JPG до 5MB</small>
        </div>
      )}
    </div>
  );
};