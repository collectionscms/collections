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
import { Language } from '../../../../constant.js';
import {
  FormValues,
  selectSourceLanguage,
} from '../../../fields/validators/projects/selectSourceLanguage.js';

import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { logger } from '../../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { useProject } from '../Context/index.js';
import { ProjectData } from './ProjectSettingsForm.js';

export type SourceLanguageData = { sourceLanguage: string };
type Props = {
  projectData: ProjectData;
  sourceLanguageData: SourceLanguageData;
  setSourceLanguageData: (l: SourceLanguageData) => void;
  handleNext: () => void;
  handleBack: () => void;
};

export const SourceLanguageForm: React.FC<Props> = ({
  projectData,
  sourceLanguageData,
  setSourceLanguageData,
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
      sourceLanguage: sourceLanguageData.sourceLanguage,
    },
    resolver: yupResolver(selectSourceLanguage()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      setSourceLanguageData(form);
      await trigger({
        ...projectData,
        sourceLanguage: form.sourceLanguage,
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
        {t('select_source_language')}
      </Typography>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="projectName">{t('source_language')}</InputLabel>
              <Stack spacing={1} direction="column">
                <Controller
                  name="sourceLanguage"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value} name="radio-buttons-group" row>
                      {Object.values(Language).map((language) => (
                        <FormControlLabel
                          {...field}
                          key={language}
                          value={language}
                          control={<Radio />}
                          label={
                            <Stack direction="row">
                              <Typography>{t(`languages.${language}`)}</Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ ml: '8px' }}
                              >
                                ({language})
                              </Typography>
                            </Stack>
                          }
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
                <FormHelperText error>{errors.sourceLanguage?.message}</FormHelperText>
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
