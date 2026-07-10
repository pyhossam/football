import { apiRequest } from './http';
import type { CreateTournamentRequest, PagedResult, Tournament } from '../types/api';

export function getTournaments() {
  return apiRequest<PagedResult<Tournament>>('/api/v1/tournaments');
}

export function createTournament(request: CreateTournamentRequest) {
  return apiRequest<Tournament>('/api/v1/tournaments', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
