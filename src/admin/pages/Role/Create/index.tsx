import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { logger } from '../../../../utilities/logger.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  createRole as createRoleSchema,
} from '../../../fields/schemas/roles/createRole.js';
import { RoleContextProvider, useRole } from '../Context/index.js';

const CreateRolePageImpl: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createRole } = useRole();
  const { data: roleId, trigger, isMutating } = createRole();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      admin_access: false,
    },
    resolver: yupResolver(createRoleSchema()),
  });

  useEffect(() => {
    if (roleId === undefined) return;
    enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
    navigate(`../roles/${roleId}`);
  }, [roleId]);

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    try {
      trigger(form);
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
      <Grid container spacing={2}>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained" type="submit" disabled={isMutating}>
              {t('save')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
        <Grid xs={1}>
          <InputLabel required>{t('name')}</InputLabel>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} type="text" fullWidth error={errors.name !== undefined} />
            )}
          />
          <FormHelperText error>{errors.name?.message}</FormHelperText>
        </Grid>
        <Grid xs={1}>
          <InputLabel>{t('admin_access')}</InputLabel>
          <Controller
            name="admin_access"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                {...field}
                label={t('is_active')}
                control={<Checkbox checked={field.value} />}
              />
            )}
          />
          <FormHelperText error>{errors.admin_access?.message}</FormHelperText>
        </Grid>
      </Grid>
      <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
        <Grid xs={1} md={2}>
          <InputLabel>{t('description')}</InputLabel>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="text"
                fullWidth
                error={errors.description !== undefined}
              />
            )}
          />
          <FormHelperText error>{errors.description?.message}</FormHelperText>
        </Grid>
      </Grid>
    </Stack>
  );
};

export const CreateRolePage = ComposeWrapper({ context: RoleContextProvider })(CreateRolePageImpl);
