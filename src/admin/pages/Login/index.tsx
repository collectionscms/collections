import { useAuth } from '@admin/components/utilities/Auth';
import loginSchema, { FormValues } from '@admin/fields/schemas/authentications/loginSchema';
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
        ? 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInVzZXJfbmFtZSI6IkFkbWluVXNlciIsInRva2VuIjoidGhpcy1pcy1hcGkta2V5Iiwicm9sZSI6eyJuYW1lIjoiQWRtaW5pc3RyYXRvciIsImFkbWluX2FjY2VzcyI6dHJ1ZSwicGVybWlzc2lvbnMiOltdfX0.qazLIKqrhJqVozAQFCBT6F3Uj45vWIH_Ye6gy1y5ZaM'
        : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJlZGl0b3JAZXhhbXBsZS5jb20iLCJ1c2VyX25hbWUiOiJFZGl0b3JVc2VyIiwidG9rZW4iOiJ0aGlzLWlzLWFwaS1rZXkiLCJyb2xlIjp7Im5hbWUiOiJFZGl0b3IiLCJhZG1pbl9hY2Nlc3MiOmZhbHNlLCJwZXJtaXNzaW9ucyI6W3siaWQiOjEsImNvbGxlY3Rpb24iOiJSZXN0YXVyYW50IiwiYWN0aW9uIjoicmVhZCJ9LHsiaWQiOjIsImNvbGxlY3Rpb24iOiJDb21wYW55IiwiYWN0aW9uIjoicmVhZCJ9LHsiaWQiOjMsImNvbGxlY3Rpb24iOiJDb21wYW55IiwiYWN0aW9uIjoiY3JlYXRlIn0seyJpZCI6NCwiY29sbGVjdGlvbiI6IkNvbXBhbnkiLCJhY3Rpb24iOiJ1cGRhdGUifSx7ImlkIjo1LCJjb2xsZWN0aW9uIjoiQ29tcGFueSIsImFjdGlvbiI6ImRlbGV0ZSJ9XX19.9mBHvnqMh6JS__JNxrKnoSPgHL4UjlGCYF0EkU42hbo';

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
            label={t('email')}
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
            label={t('password')}
            error={errors.password !== undefined}
            helperText={errors.password?.message}
          />
        )}
      />
      <div>
        <Link to="/admin/auth/forgot">{t('forgot')}</Link>
      </div>
      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        {t('login')}
      </Button>
    </Stack>
  );
};

export default LoginPage;
