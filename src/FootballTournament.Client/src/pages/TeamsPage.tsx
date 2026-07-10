import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImagePlus, Info, Shirt, ShieldPlus, Upload, UsersRound, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';
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
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

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
        logoPath: z.string().optional(),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeamForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameAr: 'فريق النخبة',
      nameEn: 'Elite FC',
      shortName: 'ELT',
      teamCode: 'ELT',
      logoPath: '',
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
        logoPath: '',
        primaryColor: '#0b6b4f',
        secondaryColor: '#d6a536',
        city: '',
        country: '',
        description: '',
      });
      await queryClient.invalidateQueries({ queryKey: ['teams', effectiveTournamentId] });
    },
  });

  const preview = watch();

  function onSubmit(values: TeamForm) {
    createMutation.mutate({
      ...values,
      teamCode: values.teamCode.toUpperCase(),
      logoPath: values.logoPath || null,
      city: values.city || null,
      country: values.country || null,
      foundationDate: null,
      description: values.description || null,
      teamManagerUserId: null,
    });
  }

  function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setValue('logoPath', reader.result, { shouldDirty: true, shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
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

      <Box className="management-grid teams-management-grid">
        <Box component="form" className="form-panel team-form-panel" onSubmit={handleSubmit(onSubmit)}>
          <Box className="panel-title-row">
            <Box>
              <Typography variant="h5">{t('createTeam')}</Typography>
              <Typography variant="body2" color="text.secondary">
                {t('teamIdentity')}
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

          <Box className="team-logo-uploader">
            <Box className="team-logo-uploader__preview">
              {preview.logoPath ? <img src={preview.logoPath} alt="" /> : <ImagePlus size={28} />}
            </Box>
            <Box>
              <Typography variant="subtitle1">{t('uploadLogo')}</Typography>
              <Button component="label" variant="outlined" startIcon={<Upload size={17} />}>
                {preview.logoPath ? t('changeLogo') : t('uploadLogo')}
                <input hidden accept="image/*" type="file" onChange={handleLogoChange} />
              </Button>
            </Box>
          </Box>

          <TextField label={t('teamNameAr')} error={Boolean(errors.nameAr)} helperText={errors.nameAr?.message} {...register('nameAr')} />
          <TextField label={t('teamNameEn')} error={Boolean(errors.nameEn)} helperText={errors.nameEn?.message} {...register('nameEn')} />
          <TextField label={t('shortName')} error={Boolean(errors.shortName)} helperText={errors.shortName?.message} {...register('shortName')} />
          <TextField label={t('teamCode')} error={Boolean(errors.teamCode)} helperText={errors.teamCode?.message} {...register('teamCode')} />
          <Box className="color-row">
            <TextField type="color" label={t('primaryColor')} InputLabelProps={{ shrink: true }} {...register('primaryColor')} />
            <TextField type="color" label={t('secondaryColor')} InputLabelProps={{ shrink: true }} {...register('secondaryColor')} />
          </Box>
          <KitPreview
            primaryColor={preview.primaryColor}
            secondaryColor={preview.secondaryColor}
            logoPath={preview.logoPath || null}
            shortName={preview.shortName || 'FC'}
          />
          <TextField label={t('city')} {...register('city')} />
          <TextField label={t('country')} {...register('country')} />
          <TextField label={t('description')} minRows={3} multiline {...register('description')} />
          <Button type="submit" variant="contained" disabled={!effectiveTournamentId || createMutation.isPending}>
            {createMutation.isPending ? t('saving') : t('createTeam')}
          </Button>
        </Box>

        <Box className="list-panel team-showcase-panel">
          <Box className="panel-title-row">
            <Typography variant="h5">{t('teams')}</Typography>
            {teamsQuery.isFetching && <CircularProgress size={18} />}
          </Box>

          {teamsQuery.isError && (
            <Alert severity="error">{teamsQuery.error instanceof Error ? teamsQuery.error.message : 'Error'}</Alert>
          )}
          {!effectiveTournamentId && <Alert severity="info">{t('noTournaments')}</Alert>}
          {teamsQuery.data?.data.items.length === 0 && <Alert severity="info">{t('noTeams')}</Alert>}

          <Box className="team-grid team-grid--showcase">
            {teamsQuery.data?.data.items.map((team) => (
              <TeamPanel key={team.id} team={team} language={language} onSelect={() => setSelectedTeam(team)} />
            ))}
          </Box>
        </Box>
      </Box>

      <TeamDetailsDialog team={selectedTeam} language={language} onClose={() => setSelectedTeam(null)} />
    </Box>
  );
}

function TeamPanel({ team, language, onSelect }: { team: Team; language: 'ar' | 'en'; onSelect: () => void }) {
  const { t } = useTranslation();
  const name = language === 'ar' ? team.nameAr : team.nameEn;

  return (
    <Box
      component="button"
      type="button"
      className="team-panel team-panel--interactive"
      style={{ '--team-primary': team.primaryColor, '--team-secondary': team.secondaryColor } as CSSProperties}
      onClick={onSelect}
    >
      <Box className="team-panel__crest">
        {team.logoPath ? <img src={team.logoPath} alt="" /> : <UsersRound size={22} />}
        <strong>{team.shortName}</strong>
      </Box>
      <Box className="team-panel__content">
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {team.teamCode} / {team.city || team.country || 'Football'}
        </Typography>
      </Box>
      <Box className="team-panel__kit-strip">
        <span style={{ background: team.primaryColor }} />
        <span style={{ background: team.secondaryColor }} />
      </Box>
      <StatusPill label={team.approvalStatus === 3 ? t('approved') : t('draft')} tone="neutral" />
      <Info className="team-panel__info-icon" size={18} />
    </Box>
  );
}

function TeamDetailsDialog({
  team,
  language,
  onClose,
}: {
  team: Team | null;
  language: 'ar' | 'en';
  onClose: () => void;
}) {
  const { t } = useTranslation();
  if (!team) {
    return null;
  }

  const name = language === 'ar' ? team.nameAr : team.nameEn;

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="team-dialog-title">
        <Box>
          <Typography variant="h5">{name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {team.teamCode} / {team.city || team.country || t('teamDetails')}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <X size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box className="team-dialog-grid">
          <Box className="team-dialog-identity" style={{ '--team-primary': team.primaryColor, '--team-secondary': team.secondaryColor } as CSSProperties}>
            <Box className="team-dialog-crest">
              {team.logoPath ? <img src={team.logoPath} alt="" /> : <Shirt size={42} />}
            </Box>
            <Typography variant="h4">{team.shortName}</Typography>
            <Typography variant="body1">{team.nameAr}</Typography>
            <Typography variant="body2" color="text.secondary">
              {team.nameEn}
            </Typography>
            <Box className="team-color-swatches">
              <span style={{ background: team.primaryColor }} />
              <span style={{ background: team.secondaryColor }} />
            </Box>
          </Box>
          <Box className="team-dialog-details">
            <Typography variant="h6">{t('kitPreview')}</Typography>
            <KitPreview
              primaryColor={team.primaryColor}
              secondaryColor={team.secondaryColor}
              logoPath={team.logoPath}
              shortName={team.shortName}
            />
            <Typography variant="h6">{t('teamDetails')}</Typography>
            <Typography variant="body2" color="text.secondary">
              {team.description || t('appSubtitle')}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

function KitPreview({
  primaryColor,
  secondaryColor,
  logoPath,
  shortName,
}: {
  primaryColor: string;
  secondaryColor: string;
  logoPath: string | null;
  shortName: string;
}) {
  const { t } = useTranslation();

  return (
    <Box className="kit-preview">
      <PlayerKit label={t('homeKit')} color={primaryColor} logoPath={logoPath} shortName={shortName} />
      <PlayerKit label={t('awayKit')} color={secondaryColor} logoPath={logoPath} shortName={shortName} />
    </Box>
  );
}

function PlayerKit({
  label,
  color,
  logoPath,
  shortName,
}: {
  label: string;
  color: string;
  logoPath: string | null;
  shortName: string;
}) {
  return (
    <Box className="player-kit" style={{ '--kit-color': color } as CSSProperties}>
      <Box className="player-kit__figure">
        <span className="player-kit__head" />
        <span className="player-kit__arm player-kit__arm--left" />
        <span className="player-kit__arm player-kit__arm--right" />
        <Box className="player-kit__shirt">
          {logoPath ? <img src={logoPath} alt="" /> : <strong>{shortName.slice(0, 3)}</strong>}
        </Box>
        <span className="player-kit__shorts" />
        <span className="player-kit__leg player-kit__leg--left" />
        <span className="player-kit__leg player-kit__leg--right" />
      </Box>
      <Typography variant="caption">{label}</Typography>
    </Box>
  );
}
