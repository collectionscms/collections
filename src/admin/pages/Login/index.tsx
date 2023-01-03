import { useAuth } from '@admin/components/utilities/Auth';
import loginSchema, { FormValues } from '@admin/fields/schemas/loginSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField } from '@mui/material';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: 'admin@example.com', password: '************' },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    const token =
      form.email === 'admin@example.com'
        ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInVzZXJOYW1lIjoiQWRtaW5Vc2VyIiwicm9sZSI6eyJuYW1lIjoiQWRtaW5pc3RyYXRvciIsImFkbWluQWNjZXNzIjp0cnVlLCJwZXJtaXNzaW9ucyI6W119fQ.sfapYjArbUhLkiqO46Q1otYxl17yXvtqVc2waA_r8s8'
        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlZGl0b3JAZXhhbXBsZS5jb20iLCJ1c2VyTmFtZSI6IkVkaXRvclVzZXIiLCJyb2xlIjp7Im5hbWUiOiJFZGl0b3IiLCJhZG1pbkFjY2VzcyI6ZmFsc2UsInBlcm1pc3Npb25zIjpbeyJpZCI6MSwiY29sbGVjdGlvbiI6IlJlc3RhdXJhbnQiLCJhY3Rpb24iOiJyZWFkIn0seyJpZCI6MiwiY29sbGVjdGlvbiI6Ik1lbnUiLCJhY3Rpb24iOiJyZWFkIn0seyJpZCI6MywiY29sbGVjdGlvbiI6Ik1lbnUiLCJhY3Rpb24iOiJjcmVhdGUifSx7ImlkIjo0LCJjb2xsZWN0aW9uIjoiTWVudSIsImFjdGlvbiI6InVwZGF0ZSJ9LHsiaWQiOjUsImNvbGxlY3Rpb24iOiJNZW51IiwiYWN0aW9uIjoiZGVsZXRlIn1dfX0.664av4vdnnKCrPC9R7WG-yJ6LmcWhVv-hyH5xz2PB5s';

    setToken(token);
    navigate('/admin/collections');
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={4} sx={{ width: '400px' }}>
      <p>Welcome to Superfast</p>
      <p>Note: </p>
      <ul>
        <li>admin@xxx - has admin role</li>
        <li>other - has editor role</li>
      </ul>

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            required
            {...field}
            variant="filled"
            type="text"
            label={t('label.email')}
            error={errors.email !== undefined}
            helperText={errors.email?.message}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            required
            {...field}
            variant="filled"
            type="password"
            label={t('label.password')}
            error={errors.password !== undefined}
            helperText={errors.password?.message}
          />
        )}
      />
      <div>
        <Link to="/admin/auth/forgot">{t('button.forgot')}</Link>
      </div>
      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        {t('button.login')}
      </Button>
    </Stack>
  );
};

export default LoginPage;
