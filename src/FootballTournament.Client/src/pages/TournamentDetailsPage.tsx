import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarRange, Save, ShieldCheck, UserPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import { assignTournamentSupervisor, getTournament, updateTournament } from '../api/tournamentsApi';
import { getUsers } from '../api/usersApi';
import { StatusPill } from '../components/StatusPill';
import { useAuthStore } from '../store/authStore';
import { useLanguage } from '../store/languageStore';
import type { UpdateTournamentRequest, User } from '../types/api';

const formats = [
  { value: 1, key: 'formatSingleMatch' },
  { value: 2, key: 'formatKnockout' },
  { value: 3, key: 'formatGroupStage' },
  { value: 4, key: 'formatGroupStageAndKnockout' },
  { value: 5, key: 'formatRoundRobin' },
  { value: 6, key: 'formatDoubleRoundRobin' },
  { value: 7, key: 'formatPointsLeague' },
  { value: 8, key: 'formatCustom' },
];

const statuses = [
  { value: 1, key: 'statusDraft' },
  { value: 2, key: 'statusRegistrationOpen' },
  { value: 3, key: 'statusRegistrationClosed' },
  { value: 4, key: 'statusDrawPending' },
  { value: 5, key: 'statusScheduled' },
  { value: 6, key: 'statusActive' },
  { value: 7, key: 'statusSuspended' },
  { value: 8, key: 'statusCompleted' },
  { value: 9, key: 'statusCancelled' },
];

export function TournamentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const auth = useAuthStore((state) => state.auth);
  const isGeneralAdmin = auth?.roles.includes('GeneralAdmin') ?? false;
  const queryClient = useQueryClient();
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');

  const tournamentQuery = useQuery({
    queryKey: ['tournament', id],
    queryFn: () => getTournament(id ?? ''),
    enabled: Boolean(id),
  });

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: isGeneralAdmin,
  });

  const schema = useMemo(
    () =>
      z.object({
        nameAr: z.string().min(2),
        nameEn: z.string().min(2),
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
        tournamentCode: z.string().min(2),
        season: z.string().min(2),
        startDate: z.string().min(1),
        endDate: z.string().min(1),
        maximumTeams: z.number().min(2),
        minimumPlayersPerTeam: z.number().min(1),
        maximumPlayersPerTeam: z.number().min(1),
        format: z.number().min(1),
        status: z.number().min(1),
        enablePublicVisibility: z.boolean(),
        country: z.string().optional(),
        city: z.string().optional(),
        location: z.string().optional(),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
      }),
    [],
  );

  type TournamentForm = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TournamentForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameAr: '',
      nameEn: '',
      slug: '',
      tournamentCode: '',
      season: '',
      startDate: '',
      endDate: '',
      maximumTeams: 16,
      minimumPlayersPerTeam: 7,
      maximumPlayersPerTeam: 25,
      format: 4,
      status: 1,
      enablePublicVisibility: false,
      country: '',
      city: '',
      location: '',
      descriptionAr: '',
      descriptionEn: '',
    },
  });

  const tournament = tournamentQuery.data?.data;
  const preview = watch();

  useEffect(() => {
    if (!tournament) {
      return;
    }

    reset({
      nameAr: tournament.nameAr,
      nameEn: tournament.nameEn,
      slug: tournament.slug,
      tournamentCode: tournament.tournamentCode,
      season: tournament.season,
      startDate: tournament.startDate,
      endDate: tournament.endDate,
      maximumTeams: tournament.maximumTeams,
      minimumPlayersPerTeam: tournament.minimumPlayersPerTeam,
      maximumPlayersPerTeam: tournament.maximumPlayersPerTeam,
      format: tournament.format,
      status: tournament.status,
      enablePublicVisibility: tournament.enablePublicVisibility,
      country: tournament.country ?? '',
      city: tournament.city ?? '',
      location: tournament.location ?? '',
      descriptionAr: tournament.descriptionAr ?? '',
      descriptionEn: tournament.descriptionEn ?? '',
    });
  }, [reset, tournament]);

  const updateMutation = useMutation({
    mutationFn: (request: UpdateTournamentRequest) => updateTournament(id ?? '', request),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tournament', id] }),
        queryClient.invalidateQueries({ queryKey: ['tournaments'] }),
      ]);
    },
  });

  const assignMutation = useMutation({
    mutationFn: (userId: string) => assignTournamentSupervisor(id ?? '', userId),
    onSuccess: async () => {
      setSelectedSupervisorId('');
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['tournament', id] }),
        queryClient.invalidateQueries({ queryKey: ['tournaments'] }),
      ]);
    },
  });

  const supervisorUsers = (usersQuery.data?.data.items ?? []).filter((user) => user.roles.includes('TournamentSupervisor'));
  const currentSupervisorIds = new Set(tournament?.supervisorUserIds ?? []);
  const assignableSupervisors = supervisorUsers.filter((user) => !currentSupervisorIds.has(user.id));
  const displayName = language === 'ar' ? preview.nameAr : preview.nameEn;

  function onSubmit(values: TournamentForm) {
    updateMutation.mutate({
      ...values,
      country: values.country || null,
      city: values.city || null,
      location: values.location || null,
      descriptionAr: values.descriptionAr || null,
      descriptionEn: values.descriptionEn || null,
    });
  }

  if (tournamentQuery.isLoading) {
    return (
      <Box className="center-page">
        <CircularProgress />
      </Box>
    );
  }

  if (tournamentQuery.isError || !tournament) {
    return (
      <Box className="page-surface">
        <Alert severity="error">{tournamentQuery.error instanceof Error ? tournamentQuery.error.message : t('noTournaments')}</Alert>
      </Box>
    );
  }

  return (
    <Box className="page-surface">
      <Box className="page-header page-header--row">
        <Box>
          <StatusPill label={isGeneralAdmin ? t('roleGeneralAdmin') : t('roleTournamentSupervisor')} tone="success" />
          <Typography variant="h3">{displayName}</Typography>
          <Typography variant="body1" color="text.secondary">
            {t('tournamentDetailsHint')}
          </Typography>
        </Box>
        <Button component={Link} to="/tournaments" variant="outlined">
          {t('tournaments')}
        </Button>
      </Box>

      <Box className="tournament-detail-grid">
        <Box component="form" className="form-panel tournament-edit-form" onSubmit={handleSubmit(onSubmit)}>
          <Box className="panel-title-row">
            <Box>
              <Typography variant="h5">{t('tournamentInfo')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('season')} {tournament.season} · {tournament.tournamentCode}
              </Typography>
            </Box>
            <CalendarRange size={22} />
          </Box>

          {updateMutation.isError && (
            <Alert severity="error">{updateMutation.error instanceof Error ? updateMutation.error.message : 'Error'}</Alert>
          )}
          {updateMutation.isSuccess && <Alert severity="success">{t('savedSuccessfully')}</Alert>}

          <Box className="form-grid">
            <TextField label={t('nameAr')} error={Boolean(errors.nameAr)} helperText={errors.nameAr?.message} {...register('nameAr')} />
            <TextField label={t('nameEn')} error={Boolean(errors.nameEn)} helperText={errors.nameEn?.message} {...register('nameEn')} />
            <TextField label={t('slug')} error={Boolean(errors.slug)} helperText={errors.slug?.message} {...register('slug')} />
            <TextField label={t('tournamentCode')} error={Boolean(errors.tournamentCode)} helperText={errors.tournamentCode?.message} {...register('tournamentCode')} />
            <TextField label={t('season')} error={Boolean(errors.season)} helperText={errors.season?.message} {...register('season')} />
            <TextField select label={t('status')} defaultValue={tournament.status} {...register('status', { valueAsNumber: true })}>
              {statuses.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {t(status.key)}
                </MenuItem>
              ))}
            </TextField>
            <TextField type="date" label={t('startDate')} InputLabelProps={{ shrink: true }} error={Boolean(errors.startDate)} helperText={errors.startDate?.message} {...register('startDate')} />
            <TextField type="date" label={t('endDate')} InputLabelProps={{ shrink: true }} error={Boolean(errors.endDate)} helperText={errors.endDate?.message} {...register('endDate')} />
            <TextField type="number" label={t('maximumTeams')} error={Boolean(errors.maximumTeams)} helperText={errors.maximumTeams?.message} {...register('maximumTeams', { valueAsNumber: true })} />
            <TextField type="number" label={t('minimumPlayers')} error={Boolean(errors.minimumPlayersPerTeam)} helperText={errors.minimumPlayersPerTeam?.message} {...register('minimumPlayersPerTeam', { valueAsNumber: true })} />
            <TextField type="number" label={t('maximumPlayers')} error={Boolean(errors.maximumPlayersPerTeam)} helperText={errors.maximumPlayersPerTeam?.message} {...register('maximumPlayersPerTeam', { valueAsNumber: true })} />
            <TextField select label={t('format')} defaultValue={tournament.format} {...register('format', { valueAsNumber: true })}>
              {formats.map((format) => (
                <MenuItem key={format.value} value={format.value}>
                  {t(format.key)}
                </MenuItem>
              ))}
            </TextField>
            <TextField label={t('country')} {...register('country')} />
            <TextField label={t('city')} {...register('city')} />
            <TextField label={t('location')} {...register('location')} />
          </Box>

          <TextField label={t('descriptionAr')} minRows={3} multiline {...register('descriptionAr')} />
          <TextField label={t('descriptionEn')} minRows={3} multiline {...register('descriptionEn')} />
          <FormControlLabel
            control={
              <Switch
                checked={preview.enablePublicVisibility}
                onChange={(event) => setValue('enablePublicVisibility', event.target.checked, { shouldDirty: true })}
              />
            }
            label={t('publicVisibility')}
          />

          <Button type="submit" variant="contained" startIcon={<Save size={18} />} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? t('saving') : t('save')}
          </Button>
        </Box>

        <Box className="list-panel tournament-side-panel">
          <Box className="panel-title-row">
            <Box>
              <Typography variant="h5">{t('tournamentSupervisors')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {isGeneralAdmin ? t('supervisorAdminHint') : t('supervisorLockedHint')}
              </Typography>
            </Box>
            <ShieldCheck size={22} />
          </Box>

          <Box className="supervisor-list">
            {tournament.supervisors.length === 0 && <Alert severity="info">{t('noSupervisors')}</Alert>}
            {tournament.supervisors.map((supervisor) => (
              <Box className="supervisor-row" key={supervisor.userId}>
                <Box className="supervisor-row__avatar">{(supervisor.fullName || supervisor.email || 'S').slice(0, 2)}</Box>
                <Box>
                  <Typography variant="subtitle1">{supervisor.fullName || supervisor.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {supervisor.email}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {isGeneralAdmin && (
            <>
              <Divider />
              <Box className="assign-supervisor-box">
                <TextField
                  select
                  label={t('addSupervisor')}
                  value={selectedSupervisorId}
                  onChange={(event) => setSelectedSupervisorId(event.target.value)}
                  disabled={usersQuery.isLoading || assignableSupervisors.length === 0}
                >
                  {assignableSupervisors.map((user: User) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.fullName || user.email}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  variant="contained"
                  startIcon={<UserPlus size={18} />}
                  disabled={!selectedSupervisorId || assignMutation.isPending}
                  onClick={() => assignMutation.mutate(selectedSupervisorId)}
                >
                  {assignMutation.isPending ? t('saving') : t('addSupervisor')}
                </Button>
                {assignMutation.isError && (
                  <Alert severity="error">{assignMutation.error instanceof Error ? assignMutation.error.message : 'Error'}</Alert>
                )}
                {assignMutation.isSuccess && <Alert severity="success">{t('supervisorAssigned')}</Alert>}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
