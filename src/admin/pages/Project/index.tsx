import Loading from '@admin/components/elements/Loading';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import updateProjectSettingSchema, {
  FormValues,
} from '@admin/fields/schemas/projectSettings/updateProjectSetting';
import { ProjectSettingContextProvider, useProjectSetting } from '@admin/stores/ProjectSetting';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const ProjectPage: React.FC = () => {
  const { localizedLabel } = useDocumentInfo();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { getProjectSetting, updateProjectSetting } = useProjectSetting();
  const { data: projectSetting, error: getProjectSettingError } = getProjectSetting({
    suspense: true,
  });
  const {
    data: updatedProjectSetting,
    trigger,
    isMutating,
    error: updateProjectSettingError,
  } = updateProjectSetting();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: projectSetting.name },
    resolver: yupResolver(updateProjectSettingSchema()),
  });

  useEffect(() => {
    if (getProjectSettingError === undefined) return;
    enqueueSnackbar(getProjectSettingError, { variant: 'error' });
  }, [getProjectSettingError]);

  useEffect(() => {
    if (updateProjectSettingError === undefined) return;
    enqueueSnackbar(updateProjectSettingError, { variant: 'error' });
  }, [updateProjectSettingError]);

  useEffect(() => {
    if (updatedProjectSetting === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
  }, [updatedProjectSetting]);

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    trigger(form);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs>
            <h1>{localizedLabel}</h1>
          </Grid>
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
                  name="name"
                  {...field}
                  type="text"
                  fullWidth
                  placeholder={`${t('input-placeholder')} Superfast`}
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

export default ComposeWrapper({ context: ProjectSettingContextProvider })(ProjectPage);
