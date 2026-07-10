import { apiRequest } from './http';
import type { CreateTeamRequest, PagedResult, Team } from '../types/api';

export function getTournamentTeams(tournamentId: string) {
  return apiRequest<PagedResult<Team>>(`/api/v1/tournaments/${tournamentId}/teams`);
}

export function createTeam(tournamentId: string, request: CreateTeamRequest) {
  return apiRequest<Team>(`/api/v1/tournaments/${tournamentId}/teams`, {
    method: 'POST',
    body: JSON.stringify(request),
  });
}
