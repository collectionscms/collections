import { GithubOutlined } from '@ant-design/icons';
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
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { privacyUrl, termsUrl } from '../../../constants/externalLinks.js';
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
  const theme = useTheme();
  const { me, getCsrfToken, login } = useAuth();
  const navigate = useNavigate();
  const { trigger, isMutating } = login();
  const { data } = getCsrfToken();
  const [csrfToken, setCsrfToken] = useState('');

  const loginPageText = process.env.PUBLIC_LOGIN_PAGE_TEXT;
  const authProviders = process.env.PUBLIC_AUTH_PROVIDERS?.split(',') ?? [];
  const enabledEmailSignIn = authProviders.includes('email');
  const enabledGoogleSignIn = authProviders.includes('google');
  const enabledGitHubSignIn = authProviders.includes('github');

  const inviteToken = new URLSearchParams(location.search).get('inviteToken') ?? '';
  const requestParams = inviteToken ? `?inviteToken=${inviteToken}` : '';

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
    if (data) {
      setValue('csrfToken', data);
      setCsrfToken(data);
    }
  }, [data]);

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

  return (
    <>
      <Box sx={{ position: 'absolute', top: 30, left: 40 }}>
        <Logo variant="logo" props={{ width: 'auto', height: 28 }} />
      </Box>
      <Stack sx={{ width: { xs: 400, lg: 475 }, gap: 3 }}>
        <AuthCard sx={{ p: 2 }}>
          <Typography variant="h3" sx={{ mb: 1, textAlign: 'center' }}>
            {t('login_title')}
          </Typography>
          <Typography variant="body2" sx={{ mt: 5, mb: 1.5, textAlign: 'center' }}>
            {loginPageText ? (
              <Box dangerouslySetInnerHTML={{ __html: loginPageText }} />
            ) : (
              t('login_subtitle')
            )}
          </Typography>
          <Stack>
            <Stack gap={2}>
              {/* Email */}
              {enabledEmailSignIn && (
                <Stack
                  component="form"
                  onSubmit={handleSubmit(onSubmit)}
                  key="email"
                  sx={{ mb: 3 }}
                >
                  <Grid container gap={1}>
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
                    <Grid xs={12} sx={{ mt: 2 }}>
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
                  </Grid>
                </Stack>
              )}

              {/* Google */}
              {enabledGoogleSignIn && (
                <form action="/api/auth/signin/google" method="POST">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  <input
                    type="hidden"
                    name="callbackUrl"
                    value={`/api/auth/providers/google${requestParams}`}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    type="submit"
                    size="large"
                    sx={{
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: theme.palette.divider,
                      },
                    }}
                  >
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                      <Box
                        component="img"
                        src={`https://cdn.collections.dev/google-logo.svg`}
                        sx={{ width: 20, height: 20 }}
                        alt="google-logo"
                      />
                      <Typography sx={{ fontSize: 16 }}>{t('sign_in_with_google')}</Typography>
                    </Stack>
                  </Button>
                </form>
              )}

              {/* GitHub */}
              {enabledGitHubSignIn && (
                <form action="/api/auth/signin/github" method="POST">
                  <input type="hidden" name="csrfToken" value={csrfToken} />
                  <input
                    type="hidden"
                    name="callbackUrl"
                    value={`/api/auth/providers/github${requestParams}`}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    type="submit"
                    size="large"
                    sx={{
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: theme.palette.divider,
                      },
                    }}
                  >
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                      <GithubOutlined style={{ fontSize: 20 }} />
                      <Typography sx={{ fontSize: 16 }}>{t('sign_in_with_github')}</Typography>
                    </Stack>
                  </Button>
                </form>
              )}
            </Stack>
          </Stack>
        </AuthCard>
        <Typography textAlign="center" variant="subtitle2">
          <Trans
            i18nKey="terms_and_privacy"
            components={{
              terms: <Link href={termsUrl} target="_blank" rel="noopener noreferrer" />,
              privacy: <Link href={privacyUrl} target="_blank" rel="noopener noreferrer" />,
            }}
          />
        </Typography>
      </Stack>
    </>
  );
};
