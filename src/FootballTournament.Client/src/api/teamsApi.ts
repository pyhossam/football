import { apiRequest } from './http';
import type { CreateTeamRequest, PagedResult, Team, UpdateTeamRequest } from '../types/api';

export function getTournamentTeams(tournamentId: string) {
  return apiRequest<PagedResult<Team>>(`/api/v1/tournaments/${tournamentId}/teams`);
}

export function createTeam(tournamentId: string, request: CreateTeamRequest) {
  return apiRequest<Team>(`/api/v1/tournaments/${tournamentId}/teams`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function updateTeam(id: string, request: UpdateTeamRequest) {
  return apiRequest<Team>(`/api/v1/teams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}
