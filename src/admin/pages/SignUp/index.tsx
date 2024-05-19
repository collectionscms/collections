import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { t } from 'i18next';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { logger } from '../../../utilities/logger.js';
import { AuthCard } from '../../@extended/components/AuthCard/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { FormValues, signUpSchema } from '../../fields/schemas/authentications/signUp.js';
import { SignUpContextProvider, useSignUp } from './Context/index.js';

const SignUpImpl: React.FC = () => {
  const { signUp } = useSignUp();
  const { trigger, isMutating } = signUp();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: email ?? '', password: '', token: token },
    resolver: yupResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <AuthCard>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{t('create_account')}</Typography>
          </Box>
        </Grid>
        <Grid xs={12}>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Stack spacing={1}>
                  <InputLabel>{t('email')}</InputLabel>
                  {email ? (
                    <Typography>{email}</Typography>
                  ) : (
                    <>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id="email"
                            type="email"
                            error={errors.email !== undefined}
                          />
                        )}
                      />
                      <FormHelperText error>{errors.email?.message}</FormHelperText>
                    </>
                  )}
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
              <Grid xs={12}>
                <Button
                  disableElevation
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={isMutating}
                >
                  {t('register')}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </AuthCard>
  );
};

export const SignUp = ComposeWrapper({ context: SignUpContextProvider })(SignUpImpl);
