import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import logger from '../../../utilities/logger';
import Logo from '../../components/elements/Logo';
import { useAuth } from '../../components/utilities/Auth';
import ComposeWrapper from '../../components/utilities/ComposeWrapper';
import { FormValues, loginSchema } from '../../fields/schemas/authentications/login';
import { LoginContextProvider, useLogin } from './Context';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const { data: token, trigger, isMutating } = login();
  const { getProjectSetting } = useLogin();
  const { data: projectSetting } = getProjectSetting();

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

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={4} sx={{ width: '400px' }}>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <Box sx={{ width: '60px', height: '60px' }}>
          <Logo />
        </Box>
        <h1>{projectSetting?.name}</h1>
      </Stack>
      <Stack>
        <InputLabel>{t('email')}</InputLabel>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField name="email" {...field} type="text" error={errors.email !== undefined} />
          )}
        />
        <FormHelperText error>{errors.email?.message}</FormHelperText>
      </Stack>
      <Stack>
        <InputLabel>{t('password')}</InputLabel>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              name="password"
              {...field}
              type="password"
              error={errors.email !== undefined}
            />
          )}
        />
        <FormHelperText error>{errors.password?.message}</FormHelperText>
      </Stack>
      <Box>
        <Link to="/admin/auth/forgot">{t('forgot')}</Link>
      </Box>
      <Button variant="contained" type="submit" size="large" disabled={isMutating}>
        {t('login')}
      </Button>
    </Stack>
  );
};

export default ComposeWrapper({ context: LoginContextProvider })(LoginPage);
