import {
  Alert,
  Box,
  Button,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { createTournament } from '../api/tournamentsApi';
import { StatusPill } from '../components/StatusPill';
import type { CreateTournamentRequest } from '../types/api';

const formats = [
  { value: 1, label: 'SingleMatch' },
  { value: 2, label: 'Knockout' },
  { value: 3, label: 'GroupStage' },
  { value: 4, label: 'GroupStageAndKnockout' },
  { value: 5, label: 'RoundRobin' },
  { value: 6, label: 'DoubleRoundRobin' },
  { value: 7, label: 'PointsLeague' },
  { value: 8, label: 'Custom' },
];

export function CreateTournamentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);
  const steps = [t('basicInfo'), t('rules'), t('review')];

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
        country: z.string().optional(),
        city: z.string().optional(),
        location: z.string().optional(),
      }),
    [],
  );

  type TournamentForm = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TournamentForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameAr: 'كأس النخبة',
      nameEn: 'Elite Cup',
      slug: `elite-cup-${new Date().getFullYear()}`,
      tournamentCode: `ELITE-${new Date().getFullYear()}`,
      season: String(new Date().getFullYear()),
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      maximumTeams: 16,
      minimumPlayersPerTeam: 7,
      maximumPlayersPerTeam: 25,
      format: 4,
      country: 'Saudi Arabia',
      city: 'Riyadh',
      location: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createTournament,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      navigate('/tournaments');
    },
  });

  function onSubmit(values: TournamentForm) {
    const request: CreateTournamentRequest = {
      ...values,
      descriptionAr: null,
      descriptionEn: null,
      country: values.country || null,
      city: values.city || null,
      location: values.location || null,
    };
    createMutation.mutate(request);
  }

  const preview = watch();

  return (
    <Box className="page-surface">
      <Box className="page-header">
        <StatusPill label={t('createTournament')} tone="success" />
        <Typography variant="h3">{t('createTournament')}</Typography>
        <Typography variant="body1" color="text.secondary">
          {t('wizardHint')}
        </Typography>
      </Box>

      <Box className="wizard-shell">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" className="wizard-form" onSubmit={handleSubmit(onSubmit)}>
          {createMutation.isError && (
            <Alert severity="error">{createMutation.error instanceof Error ? createMutation.error.message : 'Error'}</Alert>
          )}

          {activeStep === 0 && (
            <Box className="form-grid">
              <TextField label={t('nameAr')} error={Boolean(errors.nameAr)} helperText={errors.nameAr?.message} {...register('nameAr')} />
              <TextField label={t('nameEn')} error={Boolean(errors.nameEn)} helperText={errors.nameEn?.message} {...register('nameEn')} />
              <TextField label={t('slug')} error={Boolean(errors.slug)} helperText={errors.slug?.message} {...register('slug')} />
              <TextField label={t('tournamentCode')} error={Boolean(errors.tournamentCode)} helperText={errors.tournamentCode?.message} {...register('tournamentCode')} />
              <TextField label={t('season')} error={Boolean(errors.season)} helperText={errors.season?.message} {...register('season')} />
              <TextField label={t('country')} {...register('country')} />
              <TextField label={t('city')} {...register('city')} />
              <TextField label={t('location')} {...register('location')} />
            </Box>
          )}

          {activeStep === 1 && (
            <Box className="form-grid">
              <TextField type="date" label={t('startDate')} InputLabelProps={{ shrink: true }} error={Boolean(errors.startDate)} helperText={errors.startDate?.message} {...register('startDate')} />
              <TextField type="date" label={t('endDate')} InputLabelProps={{ shrink: true }} error={Boolean(errors.endDate)} helperText={errors.endDate?.message} {...register('endDate')} />
              <TextField type="number" label={t('maximumTeams')} error={Boolean(errors.maximumTeams)} helperText={errors.maximumTeams?.message} {...register('maximumTeams', { valueAsNumber: true })} />
              <TextField type="number" label={t('minimumPlayers')} error={Boolean(errors.minimumPlayersPerTeam)} helperText={errors.minimumPlayersPerTeam?.message} {...register('minimumPlayersPerTeam', { valueAsNumber: true })} />
              <TextField type="number" label={t('maximumPlayers')} error={Boolean(errors.maximumPlayersPerTeam)} helperText={errors.maximumPlayersPerTeam?.message} {...register('maximumPlayersPerTeam', { valueAsNumber: true })} />
              <TextField select label={t('format')} defaultValue={4} {...register('format', { valueAsNumber: true })}>
                {formats.map((format) => (
                  <MenuItem key={format.value} value={format.value}>
                    {format.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          )}

          {activeStep === 2 && (
            <Box className="review-card">
              <Trophy size={32} />
              <Typography variant="h4">{preview.nameAr}</Typography>
              <Typography variant="h6" color="text.secondary">
                {preview.nameEn}
              </Typography>
              <Box className="review-card__meta">
                <span>{preview.tournamentCode}</span>
                <span>{preview.season}</span>
                <span>{preview.startDate} - {preview.endDate}</span>
                <span>{preview.maximumTeams} {t('teams')}</span>
              </Box>
            </Box>
          )}

          <Box className="wizard-actions">
            <Button
              variant="outlined"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((step) => Math.max(step - 1, 0))}
              startIcon={<ArrowLeft size={18} />}
            >
              {steps[Math.max(activeStep - 1, 0)]}
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button variant="contained" onClick={() => setActiveStep((step) => Math.min(step + 1, steps.length - 1))} endIcon={<ArrowRight size={18} />}>
                {steps[activeStep + 1]}
              </Button>
            ) : (
              <Button type="submit" variant="contained" disabled={createMutation.isPending}>
                {createMutation.isPending ? t('saving') : t('create')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
