import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { RefreshCcw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getTournaments } from '../api/tournamentsApi';
import { TournamentCard } from '../components/TournamentCard';

export function TournamentsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['tournaments'],
    queryFn: getTournaments,
  });

  return (
    <Box className="page-surface">
      <Box className="page-header page-header--row">
        <Box>
          <Typography variant="h3">{t('tournamentList')}</Typography>
          <Typography variant="body1" color="text.secondary">
            {t('appSubtitle')}
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => void refetch()} startIcon={<RefreshCcw size={18} />}>
          {isFetching ? <CircularProgress color="inherit" size={18} /> : t('refresh')}
        </Button>
      </Box>

      {error && <Alert severity="error">{error instanceof Error ? error.message : 'Error'}</Alert>}
      {isLoading && <Box className="loading-block"><CircularProgress /></Box>}
      {!isLoading && !data?.data.items.length && <Alert severity="info">{t('noTournaments')}</Alert>}

      <Box className="tournament-list">
        {data?.data.items.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </Box>
    </Box>
  );
}
