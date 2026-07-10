import { apiRequest } from './http';
import type { CreateUserRequest, PagedResult, User } from '../types/api';

export function getUsers() {
  return apiRequest<PagedResult<User>>('/api/v1/users');
}

export function createUser(request: CreateUserRequest) {
  return apiRequest<User>('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
