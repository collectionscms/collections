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

import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { logger } from '../../../utilities/logger.js';
import { AuthCard } from '../../@extended/components/AuthCard/index.js';
import { Loading } from '../../components/elements/Loading/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  forgotPasswordValidator,
} from '../../fields/validators/authentications/forgotPassword.validator.js';
import { ForgotPasswordContextProvider, useForgotPassword } from './Context/index.js';
import { useTranslation } from 'react-i18next';

const ForgotPasswordImpl: React.FC = () => {
  const { t } = useTranslation();
  const { me } = useAuth();
  const navigate = useNavigate();
  const { forgotPassword } = useForgotPassword();
  const { trigger, isMutating } = forgotPassword();

  const [isRequested, setIsRequested] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '' },
    resolver: yupResolver(forgotPasswordValidator),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
      setIsRequested(true);
    } catch (e) {
      logger.error(e);
    }
  };

  if (me) {
    navigate('/admin');
    return <Loading />;
  }

  return (
    <AuthCard>
      {isRequested ? (
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
              <Typography variant="h3">{t('email_sent')}</Typography>
            </Box>
          </Grid>
          <Grid xs={12}>
            <Box>{t('check_email_to_reset_password')}</Box>
            <Box sx={{ mt: 1 }}>
              <Link variant="h6" component={RouterLink} to="/admin/auth/login">
                {t('login_now')}
              </Link>
            </Box>
          </Grid>
        </Grid>
      ) : (
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
      )}
    </AuthCard>
  );
};

export const ForgotPassword = ComposeWrapper({ context: ForgotPasswordContextProvider })(
  ForgotPasswordImpl
);
