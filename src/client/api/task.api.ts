// файл task.api.ts
// расположен по адресу src/client/api/task.api.ts

const API_URL = 'http://localhost:5000/api/tasks';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

// Вспомогательная функция для проверки ответа
const handleResponse = async (res: Response) => {
  if (res.status === 401 || res.status === 403) {
    // Токен невалиден — очищаем данные и редиректим
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
    return;
  }
  return res.json();
};

export const TaskService = {
  fetch: (userId: string, page: number) => 
    fetch(`${API_URL}/${userId}?page=${page}`, { 
      headers: getHeaders() 
    }).then(handleResponse),

  add: (userId: string, title: string) => 
    fetch(`${API_URL}/${userId}`, { 
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title })
    }).then(handleResponse),

  delete: (taskId: number) => 
    fetch(`${API_URL}/${taskId}`, { 
      method: 'DELETE', 
      headers: getHeaders() 
    }).then(handleResponse),

  toggle: (taskId: number, completed: boolean) => 
    fetch(`${API_URL}/${taskId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ completed })
    }).then(handleResponse)
};