import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import logger from '../../../utilities/logger';
import RouterLink from '../../components/elements/Link';
import Logo from '../../components/elements/Logo';
import { useAuth } from '../../components/utilities/Auth';
import ComposeWrapper from '../../components/utilities/ComposeWrapper';
import { FormValues, loginSchema } from '../../fields/schemas/authentications/login';
import { LoginContextProvider, useLogin } from './Context';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  if (user) {
    return (
      <>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <h1>{t('already_logged_in')}</h1>
        </Stack>
        <Button variant="outlined" size="large" component={RouterLink} to="/admin/collections">
          {t('back_to_home')}
        </Button>
      </>
    );
  }

  return (
    <>
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
        <Box sx={{ width: '60px', height: '60px' }}>
          <Logo />
        </Box>
        <h1>{projectSetting?.name}</h1>
      </Stack>
      <Stack component="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
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
          <RouterLink to="/admin/auth/forgot">{t('forgot')}</RouterLink>
        </Box>
        <Button variant="contained" type="submit" size="large" disabled={isMutating}>
          {t('login')}
        </Button>
      </Stack>
    </>
  );
};

export default ComposeWrapper({ context: LoginContextProvider })(LoginPage);
