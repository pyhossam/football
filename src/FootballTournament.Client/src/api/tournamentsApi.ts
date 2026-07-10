import { apiRequest } from './http';
import type { CreateTournamentRequest, PagedResult, Tournament, UpdateTournamentRequest } from '../types/api';

export function getTournaments() {
  return apiRequest<PagedResult<Tournament>>('/api/v1/tournaments');
}

export function getTournament(id: string) {
  return apiRequest<Tournament>(`/api/v1/tournaments/${id}`);
}

export function createTournament(request: CreateTournamentRequest) {
  return apiRequest<Tournament>('/api/v1/tournaments', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updateTournament(id: string, request: UpdateTournamentRequest) {
  return apiRequest<Tournament>(`/api/v1/tournaments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

export function assignTournamentSupervisor(tournamentId: string, userId: string) {
  return apiRequest<null>(`/api/v1/tournaments/${tournamentId}/supervisors`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}
