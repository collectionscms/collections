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
import { t } from 'i18next';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { logger } from '../../../utilities/logger.js';
import { AuthCard } from '../../@extended/components/AuthCard/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  forgotPasswordSchema,
} from '../../fields/schemas/authentications/forgotPassword.js';
import { ForgotPasswordContextProvider, useForgotPassword } from './Context/index.js';

const ForgotPasswordImpl: React.FC = () => {
  const { me } = useAuth();
  const { forgotPassword } = useForgotPassword();
  const { data: message, trigger, isMutating } = forgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '' },
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
    } catch (e) {
      logger.error(e);
    }
  };

  if (message) {
    return (
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{t('email_sent')}</Typography>
          </Box>
        </Grid>
        <Grid xs={12}>
          <Button
            component={RouterLink}
            to="/admin/auth/login"
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
          >
            {t('back_to_login')}
          </Button>
        </Grid>
      </Grid>
    );
  }

  if (me) {
    return (
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{t('already_logged_in')}</Typography>
          </Box>
        </Grid>
        <Grid xs={12}>
          <Button
            component={RouterLink}
            to="/admin/posts"
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            color="primary"
          >
            {t('back_to_home')}
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <AuthCard>
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{t('forgot')}</Typography>
          </Box>
        </Grid>
        <Grid xs={12}>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Stack spacing={1}>
                  <InputLabel>{t('email')}</InputLabel>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} type="text" error={errors.email !== undefined} />
                    )}
                  />
                  <FormHelperText error>{errors.email?.message}</FormHelperText>
                </Stack>
              </Grid>
              <Grid xs={12} sx={{ mt: -1 }}>
                <Link variant="h6" component={RouterLink} to="/admin/auth/login">
                  {t('back_to_login')}
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
                  {t('submit')}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </AuthCard>
  );
};

export const ForgotPassword = ComposeWrapper({ context: ForgotPasswordContextProvider })(
  ForgotPasswordImpl
);
