import { useAuth } from '@admin/components/utilities/Auth';
import loginSchema, { FormValues } from '@admin/fields/schemas/authentications/loginSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, InputLabel, Stack, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useAuth();
  const { data: token, trigger, isMutating, error } = login();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    if (token === undefined) return;
    navigate('/admin/collections');
  }, [token]);

  useEffect(() => {
    if (error === undefined) return;
    enqueueSnackbar(error, { variant: 'error' });
  }, [error]);

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    trigger(form);
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={4} sx={{ width: '400px' }}>
      <p>Welcome to Superfast</p>
      <Stack>
        <InputLabel required>{t('email')}</InputLabel>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              name="email"
              {...field}
              type="text"
              error={errors.email !== undefined}
              helperText={errors.email?.message}
            />
          )}
        />
      </Stack>
      <Stack>
        <InputLabel required>{t('password')}</InputLabel>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              name="password"
              {...field}
              type="password"
              error={errors.password !== undefined}
              helperText={errors.password?.message}
            />
          )}
        />
      </Stack>
      <Box>
        <Link to="/admin/auth/forgot">{t('forgot')}</Link>
      </Box>
      <Button variant="contained" type="submit" disabled={isMutating}>
        {t('login')}
      </Button>
    </Stack>
  );
};

export default LoginPage;
