export type ApiResponse<T> = {
  succeeded: boolean;
  data: T;
  message: string | null;
  errors: Record<string, string[]> | null;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  email: string;
  roles: string[];
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type PagedResult<T> = {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type Tournament = {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  tournamentCode: string;
  season: string;
  startDate: string;
  endDate: string;
  maximumTeams: number;
  minimumPlayersPerTeam: number;
  maximumPlayersPerTeam: number;
  format: number;
  status: number;
  enablePublicVisibility: boolean;
  supervisorUserIds: string[];
};
