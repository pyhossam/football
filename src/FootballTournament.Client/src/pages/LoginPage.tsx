import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, CircularProgress, TextField, Typography } from '@mui/material';
import { ArrowRight, Eye, LockKeyhole, Mail } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { login } from '../api/authApi';
import { StatusPill } from '../components/StatusPill';
import { useAuthStore } from '../store/authStore';

type LocationState = {
  from?: {
    pathname?: string;
  };
};

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
        password: z.string().min(1, t('passwordRequired')),
      }),
    [t],
  );

  type LoginForm = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@football.local',
      password: 'Admin@123',
    },
  });

  async function onSubmit(values: LoginForm) {
    setError(null);
    try {
      const response = await login(values);
      setAuth(response.data);
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('loginFailed'));
    }
  }

  return (
    <Box className="login-page">
      <Box className="login-page__visual">
        <Box className="score-orbit" aria-hidden="true">
          <span>2</span>
          <small>:</small>
          <span>1</span>
        </Box>
        <Box className="pitch-card">
          <StatusPill label={t('live')} tone="live" />
          <Typography variant="h2">{t('heroTitle')}</Typography>
          <Typography variant="body1">{t('heroText')}</Typography>
          <Box className="pitch-lines" aria-hidden="true" />
        </Box>
      </Box>

      <Box component="form" className="login-card" onSubmit={handleSubmit(onSubmit)}>
        <Box className="login-card__eyebrow">
          <LockKeyhole size={18} />
          {t('welcomeBack')}
        </Box>
        <Typography variant="h3">{t('login')}</Typography>
        <Typography variant="body1" color="text.secondary">
          {t('loginHint')}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box className="form-field">
          <Mail size={18} />
          <TextField
            fullWidth
            label={t('email')}
            autoComplete="email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email')}
          />
        </Box>
        <Box className="form-field">
          <Eye size={18} />
          <TextField
            fullWidth
            type="password"
            label={t('password')}
            autoComplete="current-password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register('password')}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          endIcon={isSubmitting ? <CircularProgress color="inherit" size={18} /> : <ArrowRight size={18} />}
        >
          {t('enterWorkspace')}
        </Button>

        <Button component={Link} to="/public" variant="text">
          {t('viewPublic')}
        </Button>
      </Box>
    </Box>
  );
}
