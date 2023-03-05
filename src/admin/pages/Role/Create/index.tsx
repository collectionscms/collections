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
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ComposeWrapper from '../../../components/utilities/ComposeWrapper';
import { useDocumentInfo } from '../../../components/utilities/DocumentInfo';
import createRoleSchema, { FormValues } from '../../../fields/schemas/roles/createRole';
import { RoleContextProvider, useRole } from '../Context';

const CreateRolePage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { createRole } = useRole();
  const { data, trigger, isMutating } = createRole();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      adminAccess: false,
    },
    resolver: yupResolver(createRoleSchema()),
  });

  useEffect(() => {
    if (data === undefined) return;
    enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
    navigate(`../roles/${data.id}`);
  }, [data]);

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    trigger(form);
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs={12} sm>
          <h1>{localizedLabel}</h1>
        </Grid>
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
              <TextField
                name="name"
                {...field}
                type="text"
                fullWidth
                error={errors.name !== undefined}
              />
            )}
          />
          <FormHelperText error>{errors.name?.message}</FormHelperText>
        </Grid>
        <Grid xs={1}>
          <InputLabel>{t('admin_access')}</InputLabel>
          <Controller
            name="adminAccess"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                name="isActive"
                {...field}
                label={t('is_active')}
                control={<Checkbox checked={field.value} />}
              />
            )}
          />
          <FormHelperText error>{errors.adminAccess?.message}</FormHelperText>
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
                name="description"
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

export default ComposeWrapper({ context: RoleContextProvider })(CreateRolePage);
