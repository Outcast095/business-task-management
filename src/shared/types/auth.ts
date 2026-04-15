// src/shared/types/auth.ts

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  role: 'user' | 'admin';
  is_active: boolean;
  is_verified: boolean;
}

export interface AuthUserPayload {
  userId: number;
}

// Тип для объекта req.user после middleware
export interface RequestUser extends User {
  userId: number; // для совместимости со старым кодом
}