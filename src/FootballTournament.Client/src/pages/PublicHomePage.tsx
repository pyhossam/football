import { Box, Button, Typography } from '@mui/material';
import { Activity, ArrowRight, CalendarClock, Radio, ShieldCheck, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { StatusPill } from '../components/StatusPill';

const tableRows = [
  ['Falcons', '3', '2', '1', '7'],
  ['Riyadh Stars', '3', '2', '0', '6'],
  ['United FC', '3', '1', '1', '4'],
  ['Green Line', '3', '0', '1', '1'],
];

export function PublicHomePage() {
  const { t } = useTranslation();

  return (
    <Box className="public-home">
      <Box className="public-hero">
        <Box className="public-hero__content">
          <StatusPill label={t('mobileReady')} tone="success" />
          <Typography variant="h1">{t('heroTitle')}</Typography>
          <Typography variant="body1">{t('heroText')}</Typography>
          <Box className="hero-actions">
            <Button component={Link} to="/login" variant="contained" endIcon={<ArrowRight size={18} />}>
              {t('enterWorkspace')}
            </Button>
            <Button variant="outlined" endIcon={<Radio size={18} />}>
              {t('live')}
            </Button>
          </Box>
        </Box>
        <Box className="match-center-preview">
          <Box className="match-center-preview__top">
            <StatusPill label={t('live')} tone="live" />
            <Typography variant="caption">72'</Typography>
          </Box>
          <Box className="score-row">
            <TeamBadge name="Falcons" score="2" />
            <Typography variant="h5">-</Typography>
            <TeamBadge name="United" score="1" />
          </Box>
          <Box className="timeline-strip">
            <span />
            <span />
            <span />
            <span />
          </Box>
        </Box>
      </Box>

      <Box className="public-grid">
        <Box className="feature-panel">
          <CalendarClock size={24} />
          <Typography variant="h5">{t('nextMatch')}</Typography>
          <Typography variant="body2" color="text.secondary">
            Falcons vs Riyadh Stars · 21:30
          </Typography>
        </Box>
        <Box className="feature-panel">
          <Activity size={24} />
          <Typography variant="h5">{t('recentResults')}</Typography>
          <Typography variant="body2" color="text.secondary">
            United FC 1 - 1 Green Line
          </Typography>
        </Box>
        <Box className="feature-panel">
          <Smartphone size={24} />
          <Typography variant="h5">{t('rtlReady')}</Typography>
          <Typography variant="body2" color="text.secondary">
            RTL / LTR · mobile · tablet
          </Typography>
        </Box>
      </Box>

      <Box className="standings-panel">
        <Box>
          <ShieldCheck size={24} />
          <Typography variant="h4">{t('groupStandings')}</Typography>
        </Box>
        <Box className="standings-table">
          {tableRows.map((row, index) => (
            <Box className="standings-row" key={row[0]}>
              <strong>{index + 1}</strong>
              <span>{row[0]}</span>
              <span>{row[1]}</span>
              <span>{row[2]}</span>
              <span>{row[3]}</span>
              <b>{row[4]}</b>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function TeamBadge({ name, score }: { name: string; score: string }) {
  return (
    <Box className="team-badge">
      <Box className="team-badge__crest">{name.slice(0, 1)}</Box>
      <Typography variant="body2">{name}</Typography>
      <Typography variant="h3">{score}</Typography>
    </Box>
  );
}
