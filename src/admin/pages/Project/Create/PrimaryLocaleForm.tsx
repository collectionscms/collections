import {
  Button,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Locale } from '../../../../constant.js';
import {
  FormValues,
  selectPrimaryLocale,
} from '../../../fields/validators/projects/selectPrimaryLocale.js';

import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { useProject } from '../Context/index.js';
import { ProjectData } from './ProjectSettingsForm.js';

export type PrimaryLocaleData = { primaryLocale: string };
type Props = {
  projectData: ProjectData;
  primaryLocaleData: PrimaryLocaleData;
  setPrimaryLocaleData: (l: PrimaryLocaleData) => void;
  handleNext: () => void;
  handleBack: () => void;
};

export const PrimaryLocaleForm: React.FC<Props> = ({
  projectData,
  primaryLocaleData,
  setPrimaryLocaleData,
  handleNext,
  handleBack,
}) => {
  const { t } = useTranslation();
  const { createProject } = useProject();
  const { trigger, isMutating } = createProject();

  const {
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      primaryLocale: primaryLocaleData.primaryLocale,
    },
    resolver: yupResolver(selectPrimaryLocale()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      setPrimaryLocaleData(form);
      await trigger({
        ...projectData,
        primaryLocale: form.primaryLocale,
      });
      handleNext();
      enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        {t('select_primary_language')}
      </Typography>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="projectName">{t('primary_language')}</InputLabel>
              <Stack spacing={1} direction="column">
                <Controller
                  name="primaryLocale"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} name="radio-buttons-group" row>
                      {Object.values(Locale).map((locale) => (
                        <FormControlLabel
                          {...field}
                          key={locale}
                          value={locale}
                          control={<Radio />}
                          label={t(`locale.${locale}`)}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
                <FormHelperText error>{errors.primaryLocale?.message}</FormHelperText>
              </Stack>
            </Stack>
          </Grid>
          <Grid xs={12}>
            <Stack direction="row" justifyContent="space-between">
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" type="submit">
                {t('add_project')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </>
  );
};
