import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { createUser, getUsers } from '../api/usersApi';
import { StatusPill } from '../components/StatusPill';
import type { AppRole, CreateUserRequest } from '../types/api';

const roles: AppRole[] = ['GeneralAdmin', 'TournamentSupervisor', 'TeamManager'];

export function UsersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const schema = z.object({
    email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
    password: z.string().min(8, t('passwordRequired')),
    fullName: z.string().optional(),
    role: z.enum(roles),
  });

  type UserForm = z.infer<typeof schema>;

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      reset({
        email: '',
        password: 'Admin@123',
        fullName: '',
        role: 'TournamentSupervisor',
      });
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: 'Admin@123',
      fullName: '',
      role: 'TournamentSupervisor',
    },
  });

  function onSubmit(values: UserForm) {
    createMutation.mutate(values as CreateUserRequest);
  }

  return (
    <Box className="page-surface">
      <Box className="page-header">
        <StatusPill label={t('roleGeneralAdmin')} tone="success" />
        <Typography variant="h3">{t('userManagement')}</Typography>
        <Typography variant="body1" color="text.secondary">
          {t('appSubtitle')}
        </Typography>
      </Box>

      <Box className="management-grid">
        <Box component="form" className="form-panel" onSubmit={handleSubmit(onSubmit)}>
          <Box className="panel-title-row">
            <Box>
              <Typography variant="h5">{t('createUser')}</Typography>
              <Typography variant="body2" color="text.secondary">
                General admin, supervisor, or team manager
              </Typography>
            </Box>
            <UserPlus size={22} />
          </Box>

          {createMutation.isError && (
            <Alert severity="error">{createMutation.error instanceof Error ? createMutation.error.message : 'Error'}</Alert>
          )}
          {createMutation.isSuccess && <Alert severity="success">{t('userCreated')}</Alert>}

          <TextField
            label={t('fullName')}
            error={Boolean(errors.fullName)}
            helperText={errors.fullName?.message}
            {...register('fullName')}
          />
          <TextField
            label={t('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register('email')}
          />
          <TextField
            type="password"
            label={t('password')}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register('password')}
          />
          <TextField select label={t('role')} defaultValue="TournamentSupervisor" {...register('role')}>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {roleLabel(role, t)}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" disabled={createMutation.isPending}>
            {createMutation.isPending ? t('saving') : t('createUser')}
          </Button>
        </Box>

        <Box className="list-panel">
          <Box className="panel-title-row">
            <Typography variant="h5">{t('users')}</Typography>
            {usersQuery.isFetching && <CircularProgress size={18} />}
          </Box>

          {usersQuery.isError && (
            <Alert severity="error">{usersQuery.error instanceof Error ? usersQuery.error.message : 'Error'}</Alert>
          )}
          {usersQuery.isLoading && <CircularProgress />}

          <Box className="user-list">
            {usersQuery.data?.data.items.map((user) => (
              <Box className="user-row" key={user.id}>
                <Box className="user-row__avatar">
                  {(user.fullName || user.email).slice(0, 2)}
                </Box>
                <Box>
                  <Typography variant="subtitle1">{user.fullName || user.email}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Box className="user-row__roles">
                  {user.roles.map((role) => (
                    <StatusPill key={role} label={roleLabel(role as AppRole, t)} tone="neutral" />
                  ))}
                  {user.isActive && <ShieldCheck size={18} />}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function roleLabel(role: AppRole, t: (key: string) => string) {
  if (role === 'GeneralAdmin') {
    return t('roleGeneralAdmin');
  }
  if (role === 'TournamentSupervisor') {
    return t('roleTournamentSupervisor');
  }
  return t('roleTeamManager');
}
