import locale from '@admin/fields/locales/ja/locale';
import { loginSchema } from '@admin/fields/validate';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField } from '@mui/material';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

type FormData = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: 'admin@example.com', password: '************' },
    resolver: yupResolver(loginSchema(locale)),
  });

  const onSubmit: SubmitHandler<FormData> = (form: FormData) => {
    console.log(form.email);
    console.log(form.password);
    navigate('/admin/collections');
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={4} sx={{ width: '400px' }}>
      <p>Welcome to Superfast</p>
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
