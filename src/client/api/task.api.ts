// ФАЙЛ task.api.ts
// src/client/api/task.api.ts

const API_URL = 'http://localhost:5000/api/tasks';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const TaskService = {

  fetch: (userId: string, page: number) => 
    fetch(`${API_URL}/${userId}?page=${page}`, { 
      headers: getHeaders() 
    }).then(res => res.json()),

  add: (userId: string, title: string) => 
    fetch(`${API_URL}/${userId}`, { // Здесь тоже должен быть userId
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title })
    }).then(res => res.json()),

  delete: (taskId: number) => 
    fetch(`${API_URL}/${taskId}`, { 
      method: 'DELETE', 
      headers: getHeaders() 
    }),

  toggle: (taskId: number, completed: boolean) => 
    fetch(`${API_URL}/${taskId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ completed })
    }).then(res => res.json())
};