import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { LanguageToggle } from '../components/LanguageToggle';

export function AuthLayout() {
  return (
    <Box className="auth-shell">
      <Box className="stadium-lights" aria-hidden="true" />
      <Box className="auth-shell__topbar">
        <BrandMark />
        <LanguageToggle />
      </Box>
      <Outlet />
    </Box>
  );
}
