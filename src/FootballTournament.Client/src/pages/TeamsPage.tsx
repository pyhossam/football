import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldPlus, UsersRound } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { createTeam, getTournamentTeams } from '../api/teamsApi';
import { getTournaments } from '../api/tournamentsApi';
import { StatusPill } from '../components/StatusPill';
import { useLanguage } from '../store/languageStore';
import type { CreateTeamRequest, Team } from '../types/api';

export function TeamsPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const queryClient = useQueryClient();
  const tournamentsQuery = useQuery({ queryKey: ['tournaments'], queryFn: getTournaments });
  const [selectedTournamentId, setSelectedTournamentId] = useState<string>('');

  const tournamentItems = tournamentsQuery.data?.data.items ?? [];
  const effectiveTournamentId = selectedTournamentId || tournamentItems[0]?.id || '';

  const teamsQuery = useQuery({
    queryKey: ['teams', effectiveTournamentId],
    queryFn: () => getTournamentTeams(effectiveTournamentId),
    enabled: Boolean(effectiveTournamentId),
  });

  const schema = useMemo(
    () =>
      z.object({
        nameAr: z.string().min(2),
        nameEn: z.string().min(2),
        shortName: z.string().min(2).max(30),
        teamCode: z.string().min(2).regex(/^[A-Z0-9-]+$/),
        primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
        city: z.string().optional(),
        country: z.string().optional(),
        description: z.string().optional(),
      }),
    [],
  );

  type TeamForm = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameAr: 'فريق النخبة',
      nameEn: 'Elite FC',
      shortName: 'ELT',
      teamCode: 'ELT',
      primaryColor: '#0b6b4f',
      secondaryColor: '#d6a536',
      city: 'Riyadh',
      country: 'Saudi Arabia',
      description: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (request: CreateTeamRequest) => createTeam(effectiveTournamentId, request),
    onSuccess: async () => {
      reset({
        nameAr: '',
        nameEn: '',
        shortName: '',
        teamCode: '',
        primaryColor: '#0b6b4f',
        secondaryColor: '#d6a536',
        city: '',
        country: '',
        description: '',
      });
      await queryClient.invalidateQueries({ queryKey: ['teams', effectiveTournamentId] });
    },
  });

  function onSubmit(values: TeamForm) {
    createMutation.mutate({
      ...values,
      teamCode: values.teamCode.toUpperCase(),
      city: values.city || null,
      country: values.country || null,
      foundationDate: null,
      description: values.description || null,
      teamManagerUserId: null,
    });
  }

  return (
    <Box className="page-surface">
      <Box className="page-header">
        <StatusPill label={t('teamManagement')} tone="success" />
        <Typography variant="h3">{t('teamManagement')}</Typography>
        <Typography variant="body1" color="text.secondary">
          {t('appSubtitle')}
        </Typography>
      </Box>

      <Box className="management-grid">
        <Box component="form" className="form-panel" onSubmit={handleSubmit(onSubmit)}>
          <Box className="panel-title-row">
            <Box>
              <Typography variant="h5">{t('createTeam')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('selectTournament')}
              </Typography>
            </Box>
            <ShieldPlus size={22} />
          </Box>

          <TextField
            select
            label={t('selectTournament')}
            value={effectiveTournamentId}
            onChange={(event) => setSelectedTournamentId(event.target.value)}
            disabled={!tournamentItems.length}
          >
            {tournamentItems.map((tournament) => (
              <MenuItem key={tournament.id} value={tournament.id}>
                {language === 'ar' ? tournament.nameAr : tournament.nameEn}
              </MenuItem>
            ))}
          </TextField>

          {createMutation.isError && (
            <Alert severity="error">{createMutation.error instanceof Error ? createMutation.error.message : 'Error'}</Alert>
          )}
          {createMutation.isSuccess && <Alert severity="success">{t('teamCreated')}</Alert>}

          <TextField label={t('teamNameAr')} error={Boolean(errors.nameAr)} helperText={errors.nameAr?.message} {...register('nameAr')} />
          <TextField label={t('teamNameEn')} error={Boolean(errors.nameEn)} helperText={errors.nameEn?.message} {...register('nameEn')} />
          <TextField label={t('shortName')} error={Boolean(errors.shortName)} helperText={errors.shortName?.message} {...register('shortName')} />
          <TextField label={t('teamCode')} error={Boolean(errors.teamCode)} helperText={errors.teamCode?.message} {...register('teamCode')} />
          <Box className="color-row">
            <TextField type="color" label={t('primaryColor')} InputLabelProps={{ shrink: true }} {...register('primaryColor')} />
            <TextField type="color" label={t('secondaryColor')} InputLabelProps={{ shrink: true }} {...register('secondaryColor')} />
          </Box>
          <TextField label={t('city')} {...register('city')} />
          <TextField label={t('country')} {...register('country')} />
          <Button type="submit" variant="contained" disabled={!effectiveTournamentId || createMutation.isPending}>
            {createMutation.isPending ? t('saving') : t('createTeam')}
          </Button>
        </Box>

        <Box className="list-panel">
          <Box className="panel-title-row">
            <Typography variant="h5">{t('teams')}</Typography>
            {teamsQuery.isFetching && <CircularProgress size={18} />}
          </Box>

          {teamsQuery.isError && (
            <Alert severity="error">{teamsQuery.error instanceof Error ? teamsQuery.error.message : 'Error'}</Alert>
          )}
          {!effectiveTournamentId && <Alert severity="info">{t('noTournaments')}</Alert>}
          {teamsQuery.data?.data.items.length === 0 && <Alert severity="info">{t('noTeams')}</Alert>}

          <Box className="team-grid">
            {teamsQuery.data?.data.items.map((team) => (
              <TeamPanel key={team.id} team={team} language={language} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function TeamPanel({ team, language }: { team: Team; language: 'ar' | 'en' }) {
  const name = language === 'ar' ? team.nameAr : team.nameEn;

  return (
    <Box className="team-panel" style={{ '--team-primary': team.primaryColor, '--team-secondary': team.secondaryColor } as CSSProperties}>
      <Box className="team-panel__crest">
        <UsersRound size={22} />
        <strong>{team.shortName}</strong>
      </Box>
      <Box>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {team.teamCode} · {team.city || team.country || 'Football'}
        </Typography>
      </Box>
      <StatusPill label={String(team.approvalStatus)} tone="neutral" />
    </Box>
  );
}
