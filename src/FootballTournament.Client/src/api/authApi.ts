import { apiRequest } from './http';
import type { AuthResponse, LoginRequest } from '../types/api';

export function login(request: LoginRequest) {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
    skipAuth: true,
  });
}
