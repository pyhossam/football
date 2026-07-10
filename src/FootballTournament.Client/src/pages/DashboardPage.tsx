import { Box, Typography } from '@mui/material';
import { CalendarCheck2, Goal, Shield, Trophy, UsersRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { StatTile } from '../components/StatTile';
import { StatusPill } from '../components/StatusPill';

const chartData = [
  { day: 'Sat', goals: 4 },
  { day: 'Sun', goals: 7 },
  { day: 'Mon', goals: 5 },
  { day: 'Tue', goals: 9 },
  { day: 'Wed', goals: 8 },
  { day: 'Thu', goals: 12 },
];

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <Box className="page-surface">
      <Box className="page-header">
        <Box>
          <StatusPill label={t('apiOnline')} tone="success" />
          <Typography variant="h3">{t('dashboard')}</Typography>
          <Typography variant="body1" color="text.secondary">
            {t('appSubtitle')}
          </Typography>
        </Box>
      </Box>

      <Box className="stat-grid">
        <StatTile label={t('activeTournaments')} value="1" helper="+1 draft" icon={Trophy} />
        <StatTile label={t('registeredTeams')} value="16" helper="capacity ready" icon={Shield} />
        <StatTile label={t('totalPlayers')} value="220" helper="projected squads" icon={UsersRound} />
        <StatTile label={t('todayMatches')} value="4" helper={t('live')} icon={CalendarCheck2} />
      </Box>

      <Box className="dashboard-grid">
        <Box className="analytics-panel">
          <Box className="panel-title-row">
            <Box>
              <Typography variant="h5">{t('completion')}</Typography>
              <Typography variant="body2" color="text.secondary">
                Group stage performance pulse
              </Typography>
            </Box>
            <Goal size={22} />
          </Box>
          <Box className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="goalsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0b6b4f" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#0b6b4f" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce6df" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="goals" stroke="#0b6b4f" fill="url(#goalsGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        <Box className="match-panel">
          <Typography variant="h5">{t('nextMatch')}</Typography>
          <Box className="match-panel__score">
            <span>Falcons</span>
            <strong>21:30</strong>
            <span>Riyadh Stars</span>
          </Box>
          <Box className="match-panel__field" aria-hidden="true">
            <span />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
