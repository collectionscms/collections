import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormHelperText,
  InputLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logger } from '../../../utilities/logger.js';
import { AuthCard } from '../../@extended/components/AuthCard/index.js';
import { Loader } from '../../components/elements/Loader/index.js';
import { Logo } from '../../components/elements/Logo/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import {
  FormValues,
  loginValidator,
} from '../../fields/validators/authentications/login.validator.js';
import lazy from '../../utilities/lazy.js';

const Loading = Loader(lazy(() => import('../../components/elements/Loading/index.js'), 'Loading'));

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const { me, getCsrfToken, login } = useAuth();
  const navigate = useNavigate();
  const { trigger, isMutating } = login();
  const { data: csrfToken } = getCsrfToken();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '', csrfToken: '' },
    resolver: yupResolver(loginValidator),
  });

  useEffect(() => {
    if (csrfToken) {
      setValue('csrfToken', csrfToken);
    }
  }, [csrfToken]);

  useEffect(() => {
    if (!me) return;
    navigate('/admin');
  }, [me]);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
    } catch (e) {
      logger.error(e);
    }
  };

  if (me) return <Loading />;

  const loginPageText = process.env.PUBLIC_LOGIN_PAGE_TEXT ?? '';

  return (
    <AuthCard>
      <Stack spacing={3.5}>
        <Stack direction="row" justifyContent="left" alignItems="center" spacing={1}>
          <Box sx={{ width: '40px', height: '40px' }}>
            <Logo />
          </Box>
          <Typography variant="h3">Collections</Typography>
        </Stack>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email">{t('email')}</InputLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="email"
                      type="text"
                      error={errors.email !== undefined}
                    />
                  )}
                />
                <FormHelperText error>{errors.email?.message}</FormHelperText>
              </Stack>
            </Grid>
            <Grid xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password">{t('password')}</InputLabel>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="password"
                      type="password"
                      error={errors.password !== undefined}
                    />
                  )}
                />
                <FormHelperText error>{errors.password?.message}</FormHelperText>
              </Stack>
            </Grid>
            <Grid xs={12} sx={{ mt: -1 }}>
              <Link variant="h6" component={RouterLink} to="/admin/auth/sign-up">
                {t('create_account')}
              </Link>
            </Grid>
            <Grid xs={12} sx={{ mt: -1 }}>
              <Link variant="h6" component={RouterLink} to="/admin/auth/forgot">
                {t('forgot')}
              </Link>
            </Grid>
            <Grid xs={12}>
              <Button
                disableElevation
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                disabled={isMutating}
              >
                {t('login')}
              </Button>
            </Grid>
            {loginPageText && <div dangerouslySetInnerHTML={{ __html: loginPageText }} />}
          </Grid>
        </Stack>
      </Stack>
    </AuthCard>
  );
};
