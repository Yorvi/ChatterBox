export interface User {
  id: number;
  username: string;
  email: string;
  role?: 'user' | 'admin';
  profilePhoto?: string | null;
  coverPhoto?: string | null;
  bio?: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
