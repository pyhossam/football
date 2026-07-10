import { Box, Button, Typography } from '@mui/material';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function AccessDeniedPage() {
  const { t } = useTranslation();

  return (
    <Box className="center-page">
      <ShieldAlert size={46} />
      <Typography variant="h4">{t('accessDenied')}</Typography>
      <Button component={Link} to="/dashboard" variant="contained">
        {t('dashboard')}
      </Button>
    </Box>
  );
}
