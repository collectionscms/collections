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
        ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInVzZXJOYW1lIjoiQWRtaW5Vc2VyIiwidG9rZW4iOiJ0aGlzLWlzLWFwaS1rZXkiLCJyb2xlIjp7Im5hbWUiOiJBZG1pbmlzdHJhdG9yIiwiYWRtaW5BY2Nlc3MiOnRydWUsInBlcm1pc3Npb25zIjpbXX19.3QDhNqj373vCcouj2u9Cq1CsxE5VsmlpsVDurIwM6Gw'
        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlZGl0b3JAZXhhbXBsZS5jb20iLCJ1c2VyTmFtZSI6IkVkaXRvclVzZXIiLCJ0b2tlbiI6InRoaXMtaXMtYXBpLWtleSIsInJvbGUiOnsibmFtZSI6IkVkaXRvciIsImFkbWluQWNjZXNzIjpmYWxzZSwicGVybWlzc2lvbnMiOlt7ImlkIjoxLCJjb2xsZWN0aW9uIjoiUmVzdGF1cmFudCIsImFjdGlvbiI6InJlYWQifSx7ImlkIjoyLCJjb2xsZWN0aW9uIjoiTWVudSIsImFjdGlvbiI6InJlYWQifSx7ImlkIjozLCJjb2xsZWN0aW9uIjoiTWVudSIsImFjdGlvbiI6ImNyZWF0ZSJ9LHsiaWQiOjQsImNvbGxlY3Rpb24iOiJNZW51IiwiYWN0aW9uIjoidXBkYXRlIn0seyJpZCI6NSwiY29sbGVjdGlvbiI6Ik1lbnUiLCJhY3Rpb24iOiJkZWxldGUifV19fQ.oIy1dUAUG696Z-tV5sNwPlBH2aRJjTrh6fwKP3pJgms';

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
