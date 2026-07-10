import { Box, Button } from '@mui/material';
import { LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { LanguageToggle } from '../components/LanguageToggle';

export function PublicLayout() {
  const { t } = useTranslation();

  return (
    <Box className="public-shell">
      <Box className="public-shell__nav">
        <BrandMark compact />
        <Box className="nav-actions">
          <LanguageToggle />
          <Button component={Link} to="/login" variant="contained" startIcon={<LogIn size={18} />}>
            {t('login')}
          </Button>
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
}
