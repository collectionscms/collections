import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormHelperText, InputLabel, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import dayjs from 'dayjs';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MainCard } from 'superfast-ui';
import { logger } from '../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../components/elements/ConfirmDiscardDialog/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateProjectSetting as updateProjectSettingSchema,
} from '../../fields/schemas/projectSettings/updateProjectSetting.js';
import { useUnsavedChangesPrompt } from '../../hooks/useUnsavedChangesPrompt.js';
import { ProjectSettingContextProvider, useProjectSetting } from './Context/index.js';

const ProjectImpl: React.FC = () => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { getProjectSetting, updateProjectSetting } = useProjectSetting();
  const { data: projectSetting } = getProjectSetting();
  const { trigger, isMutating } = updateProjectSetting();
  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: projectSetting.name,
      before_login: projectSetting.before_login,
      after_login: projectSetting.after_login,
    },
    resolver: yupResolver(updateProjectSettingSchema()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="project_name">{t('project_name')}</InputLabel>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="project_name"
                          type="text"
                          fullWidth
                          placeholder={`${t('input_placeholder')} Superfast`}
                          error={errors.name !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.name?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="before_login">{t('login_top_label')}</InputLabel>
                    <Controller
                      name="before_login"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="before_login"
                          type="text"
                          multiline
                          rows={2}
                          fullWidth
                          placeholder={`${t('input_placeholder')} Support Hours 9:00 - 18:00`}
                          error={errors.before_login !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.before_login?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="after_login">{t('login_bottom_label')}</InputLabel>
                    <Controller
                      name="after_login"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="after_login"
                          type="text"
                          multiline
                          rows={2}
                          fullWidth
                          placeholder={`${t(
                            'input_placeholder'
                          )} Copyright © ${dayjs().year()} Your Company.`}
                          error={errors.after_login !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.after_login?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <Button variant="contained" type="submit" disabled={isMutating}>
                      {t('update')}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export const Project = ComposeWrapper({ context: ProjectSettingContextProvider })(ProjectImpl);
