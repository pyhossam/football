import { apiRequest } from './http';
import type { PagedResult, Tournament } from '../types/api';

export function getTournaments() {
  return apiRequest<PagedResult<Tournament>>('/api/v1/tournaments');
}
