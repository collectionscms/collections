import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../utilities/logger.js';
import { Loading } from '../../components/elements/Loading/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateProjectSetting as updateProjectSettingSchema,
} from '../../fields/schemas/projectSettings/updateProjectSetting.js';
import { ProjectSettingContextProvider, useProjectSetting } from './Context/index.js';

const ProjectImpl: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { getProjectSetting, updateProjectSetting } = useProjectSetting();
  const { data: projectSetting } = getProjectSetting({
    suspense: true,
  });
  const { data: updatedProjectSetting, trigger, isMutating } = updateProjectSetting();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: projectSetting?.name },
    resolver: yupResolver(updateProjectSettingSchema()),
  });

  useEffect(() => {
    if (updatedProjectSetting === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
  }, [updatedProjectSetting]);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={2}>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid>
              <Button variant="contained" type="submit" disabled={isMutating}>
                {t('update')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container columns={{ xs: 1, lg: 4 }}>
          <Grid xs={1}>
            <InputLabel required>{t('project_name')}</InputLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  placeholder={`${t('input_placeholder')} Superfast`}
                  error={errors.name !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.name?.message}</FormHelperText>
          </Grid>
        </Grid>
      </Stack>
    </Suspense>
  );
};

export const Project = ComposeWrapper({ context: ProjectSettingContextProvider })(ProjectImpl);
