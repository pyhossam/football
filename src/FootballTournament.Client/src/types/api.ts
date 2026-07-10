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
  descriptionAr: string | null;
  descriptionEn: string | null;
  tournamentCode: string;
  season: string;
  country: string | null;
  city: string | null;
  location: string | null;
  startDate: string;
  endDate: string;
  maximumTeams: number;
  minimumPlayersPerTeam: number;
  maximumPlayersPerTeam: number;
  format: number;
  status: number;
  enablePublicVisibility: boolean;
  supervisorUserIds: string[];
  supervisors: TournamentSupervisor[];
};

export type TournamentSupervisor = {
  userId: string;
  fullName: string | null;
  email: string | null;
};

export type CreateTournamentRequest = {
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
  descriptionAr?: string | null;
  descriptionEn?: string | null;
  country?: string | null;
  city?: string | null;
  location?: string | null;
};

export type UpdateTournamentRequest = CreateTournamentRequest & {
  status: number;
  enablePublicVisibility: boolean;
};

export type AppRole = 'GeneralAdmin' | 'TournamentSupervisor' | 'TeamManager';

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  isActive: boolean;
  createdAt: string;
  roles: string[];
};

export type CreateUserRequest = {
  email: string;
  password: string;
  fullName?: string | null;
  role: AppRole;
};

export type Team = {
  id: string;
  tournamentId: string;
  nameAr: string;
  nameEn: string;
  shortName: string;
  teamCode: string;
  logoPath: string | null;
  primaryColor: string;
  secondaryColor: string;
  city: string | null;
  country: string | null;
  foundationDate: string | null;
  description: string | null;
  teamManagerUserId: string | null;
  approvalStatus: number;
  registrationStatus: number;
  isActive: boolean;
  createdAt: string;
};

export type CreateTeamRequest = {
  nameAr: string;
  nameEn: string;
  shortName: string;
  teamCode: string;
  logoPath?: string | null;
  primaryColor: string;
  secondaryColor: string;
  city?: string | null;
  country?: string | null;
  foundationDate?: string | null;
  description?: string | null;
  teamManagerUserId?: string | null;
};

export type UpdateTeamRequest = Omit<CreateTeamRequest, 'teamCode'> & {
  approvalStatus: number;
  registrationStatus: number;
  isActive: boolean;
};
