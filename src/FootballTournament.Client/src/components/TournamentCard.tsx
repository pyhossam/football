import { Box, Button, Typography } from '@mui/material';
import { CalendarDays, ShieldCheck, UsersRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguage } from '../store/languageStore';
import type { Tournament } from '../types/api';
import { StatusPill } from './StatusPill';

type TournamentCardProps = {
  tournament: Tournament;
};

export function TournamentCard({ tournament }: TournamentCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const name = language === 'ar' ? tournament.nameAr : tournament.nameEn;

  return (
    <Box className="tournament-card">
      <Box className="tournament-card__crest" aria-hidden="true">
        {name.slice(0, 2)}
      </Box>
      <Box className="tournament-card__body">
        <Box className="tournament-card__header">
          <Box>
            <Typography variant="h6">{name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {t('season')} {tournament.season} · {tournament.tournamentCode}
            </Typography>
          </Box>
          <StatusPill label={tournament.enablePublicVisibility ? t('public') : t('private')} tone="success" />
        </Box>
        <Box className="tournament-card__meta">
          <span>
            <CalendarDays size={16} />
            {tournament.startDate} - {tournament.endDate}
          </span>
          <span>
            <UsersRound size={16} />
            {tournament.maximumTeams} {t('teams')}
          </span>
          <span>
            <ShieldCheck size={16} />
            {t('status')} {tournament.status}
          </span>
        </Box>
      </Box>
      <Button component={Link} to={`/tournaments/${tournament.id}`} variant="outlined" size="small">
        {t('details')}
      </Button>
    </Box>
  );
}
