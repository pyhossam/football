import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { BarChart3, CalendarRange, LogOut, Menu, Shield, UserCog, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { LanguageToggle } from '../components/LanguageToggle';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { to: '/dashboard', icon: BarChart3, labelKey: 'dashboard' },
  { to: '/tournaments', icon: CalendarRange, labelKey: 'tournaments' },
  { to: '/teams', icon: UsersRound, labelKey: 'teams' },
  { to: '/users', icon: UserCog, labelKey: 'users' },
  { to: '/public', icon: Shield, labelKey: 'publicPortal' },
];

export function AdminLayout() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const auth = useAuthStore((state) => state.auth);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <Box className="admin-shell">
      <Box className={`admin-sidebar ${open ? 'admin-sidebar--open' : ''}`}>
        <BrandMark />
        <Box className="admin-sidebar__nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
                <Icon size={20} />
                <span>{t(item.labelKey)}</span>
              </NavLink>
            );
          })}
        </Box>
        <Box className="admin-sidebar__user">
          <Shield size={18} />
          <Box>
            <Typography variant="body2">{auth?.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              {t('role')}: {auth?.roles.join(', ')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="admin-main">
        <Box className="admin-topbar">
          <Tooltip title="Menu">
            <IconButton className="mobile-menu-button" onClick={() => setOpen((value) => !value)}>
              <Menu size={21} />
            </IconButton>
          </Tooltip>
          <Typography variant="h6">{t('appName')}</Typography>
          <Box className="nav-actions">
            <Button component={Link} to="/public" variant="text">
              {t('publicPortal')}
            </Button>
            <LanguageToggle />
            <Tooltip title={t('logout')}>
              <IconButton onClick={handleLogout} className="glass-icon-button">
                <LogOut size={20} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Outlet />
      </Box>
    </Box>
  );
}
