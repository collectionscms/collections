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
import { enqueueSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { logger } from '../../../utilities/logger.js';
import { AuthCard } from '../../@extended/components/AuthCard/index.js';
import { Loading } from '../../components/elements/Loading/index.js';
import { useAuth } from '../../components/utilities/Auth/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  resetPasswordValidator,
} from '../../fields/validators/authentications/resetPassword.validator.js';
import { ResetPasswordContextProvider, useResetPassword } from './Context/index.js';

const ResetPasswordImpl: React.FC = () => {
  const { me } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { resetPassword } = useResetPassword();
  const { trigger, isMutating } = resetPassword();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { password: '', token: token },
    resolver: yupResolver(resetPasswordValidator(t)),
  });

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), {
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
      navigate('../users');
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
      <Grid container spacing={3}>
        <Grid xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{t('reset_password')}</Typography>
          </Box>
        </Grid>
        <Grid xs={12}>
          <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={12}>
                <Stack spacing={1}>
                  <Controller
                    name="token"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} type="hidden" sx={{ display: 'none' }} />
                    )}
                  />
                  <input type="hidden" {...register('token')} value={token} />
                  <InputLabel>{t('new_password')}</InputLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} type="password" error={errors.password !== undefined} />
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
                  {t('save')}
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>
    </AuthCard>
  );
};

export const ResetPassword = ComposeWrapper({ context: ResetPasswordContextProvider })(
  ResetPasswordImpl
);
